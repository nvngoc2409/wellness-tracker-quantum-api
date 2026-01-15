const Insight = require('../models/insight.model.js');
const Album = require('../models/album.model.js');
const mongoose = require('mongoose');
const Category = require('../models/category.model.js');

// Helper to format Date object to YYYY-MM-DD
function formatDateToYMD(d) {
  const year = d.getFullYear();
  const month = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const relaxKeywords = [
  "relax",
  "calm",
  "chill",
  "peace",
  "tranquil",
  "serene",
  "soft",
  "slow",
  "gentle",
  "ambient",
]

/**
 * @desc    Get or create insight for a date (random 3 albums)
 * @route   GET /api/insight?date=YYYY-MM-DD
 * @access  Private
 */
exports.getInsight = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ success: false, error: 'Please provide date in YYYY-MM-DD format' });
    }

    // parse YYYY-MM-DD (ISO-like)
    const parts = date.split('-');
    if (parts.length !== 3) {
      return res.status(400).json({ success: false, error: 'Invalid date format. Use YYYY-MM-DD' });
    }

    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // zero-indexed
    const day = parseInt(parts[2], 10);
    if (Number.isNaN(day) || Number.isNaN(month) || Number.isNaN(year)) {
      return res.status(400).json({ success: false, error: 'Invalid date parts' });
    }

    const targetDateObj = new Date(year, month, day);
    targetDateObj.setHours(0, 0, 0, 0);
    const targetDate = formatDateToYMD(targetDateObj);

    const userId = req.user.id;

    // 1) Check existing insight for this user + date
    let existing = await Insight.findOne({ user_id: userId, date: targetDate }).populate('albums');

    if (existing) {
      // attach categories to each album before returning
      const albumsRaw = existing.albums.map(a => a.toObject ? a.toObject() : a);
      // collect subcategory ids
      const subIds = new Set();
      for (const a of albumsRaw) {
        if (Array.isArray(a.subcategories)) {
          for (const s of a.subcategories) {
            if (!s) continue;
            const sub = s.subcategory || s;
            const sid = (typeof sub === 'object' && sub._id) ? sub._id.toString() : sub.toString();
            subIds.add(sid);
          }
        }
      }

      let categories = [];
      if (subIds.size) {
        const subIdList = Array.from(subIds);
        categories = await Category.find({ 'subcategories.subcategory': { $in: subIdList } })
          .populate({ path: 'subcategories.subcategory', select: 'name' })
          .lean();
      }

      // build map sub -> category
      const subToCategory = {};
      for (const c of categories) {
        if (!Array.isArray(c.subcategories)) continue;
        for (const s of c.subcategories) {
          if (!s || !s.subcategory) continue;
          const sid = (typeof s.subcategory === 'object' && s.subcategory._id) ? s.subcategory._id.toString() : s.subcategory.toString();
          if (!subToCategory[sid]) subToCategory[sid] = { _id: c._id, name: c.name, cover_image: c.cover_image, description: c.description };
        }
      }

      for (const a of albumsRaw) {
        const catSet = {};
        a.categories = [];
        if (Array.isArray(a.subcategories)) {
          for (const s of a.subcategories) {
            if (!s) continue;
            const sub = s.subcategory || s;
            const sid = (typeof sub === 'object' && sub._id) ? sub._id.toString() : sub.toString();
            const cat = subToCategory[sid];
            if (cat && !catSet[cat._id.toString()]) {
              catSet[cat._id.toString()] = true;
              a.categories.push(cat);
            }
          }
        }
      }

      return res.status(200).json({ success: true, data: albumsRaw });
    }

    // 2) Get latest user's insight before the requested date to exclude its albums
    const latest = await Insight.findOne({ user_id: userId, date: { $lt: targetDate } }).sort({ date: -1 }).select('albums');
    const excludeIds = latest && latest.albums ? latest.albums : [];

    // Build filter for albums with relaxKeywords in title or description
    // Match albums where name OR description contains any of the relaxKeywords
    const keywordConditions = [];
    for (const keyword of relaxKeywords) {
      keywordConditions.push({ name: { $regex: keyword, $options: 'i' } });
      keywordConditions.push({ description: { $regex: keyword, $options: 'i' } });
    }
    const relaxKeywordMatch = { $or: keywordConditions };

    // 3) Try to sample 3 random albums excluding the latest albums and matching relaxKeywords
    let sampled = [];
    try {
      const matchConditions = [relaxKeywordMatch];

      if (excludeIds && excludeIds.length) {
        matchConditions.push({ _id: { $nin: excludeIds } });
      }

      const match = { $and: matchConditions };
      sampled = await Album.aggregate([
        { $match: match },
        { $sample: { size: 3 } }
      ]);
    } catch (e) {
      sampled = [];
    }

    // If not enough results (e.g., excluded too many), sample without exclusion but still with relaxKeywords filter
    if (!sampled || sampled.length < 3) {
      sampled = await Album.aggregate([
        { $match: relaxKeywordMatch },
        { $sample: { size: 3 } }
      ]);
    }

    // Ensure we have up to 3 unique albums
    const finalAlbums = sampled.slice(0, 3);

    // attach categories to each album
    const albumsRaw = finalAlbums.map(a => a.toObject ? a.toObject() : a);
    const subIds = new Set();
    for (const a of albumsRaw) {
      if (Array.isArray(a.subcategories)) {
        for (const s of a.subcategories) {
          if (!s) continue;
          const sub = s.subcategory || s;
          const sid = (typeof sub === 'object' && sub._id) ? sub._id.toString() : sub.toString();
          subIds.add(sid);
        }
      }
    }

    let categories = [];
    const subIdList = Array.from(subIds);
    if (subIdList.length) {
      categories = await Category.find({ 'subcategories.subcategory': { $in: subIdList } })
        .populate({ path: 'subcategories.subcategory', select: 'name' })
        .lean();
    }

    const subToCategory = {};
    for (const c of categories) {
      if (!Array.isArray(c.subcategories)) continue;
      for (const s of c.subcategories) {
        if (!s || !s.subcategory) continue;
        const sid = (typeof s.subcategory === 'object' && s.subcategory._id) ? s.subcategory._id.toString() : s.subcategory.toString();
        if (!subToCategory[sid]) subToCategory[sid] = { _id: c._id, name: c.name, cover_image: c.cover_image, description: c.description };
      }
    }

    for (const a of albumsRaw) {
      const catSet = {};
      a.categories = [];
      if (Array.isArray(a.subcategories)) {
        for (const s of a.subcategories) {
          if (!s) continue;
          const sub = s.subcategory || s;
          const sid = (typeof sub === 'object' && sub._id) ? sub._id.toString() : sub.toString();
          const cat = subToCategory[sid];
          if (cat && !catSet[cat._id.toString()]) {
            catSet[cat._id.toString()] = true;
            a.categories.push(cat);
          }
        }
      }
    }

    // Save insight record
    const albumIds = finalAlbums.map(a => a._id);

    const newInsight = new Insight({
      user_id: userId,
      date: targetDate,
      albums: albumIds
    });

    await newInsight.save();

    return res.status(200).json({ success: true, data: albumsRaw });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: 'Server Error' });
  }
};