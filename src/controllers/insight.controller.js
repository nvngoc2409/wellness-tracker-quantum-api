const Insight = require('../models/insight.model.js');
const Album = require('../models/album.model.js');
const mongoose = require('mongoose');

// Helper to format Date object to YYYY-MM-DD
function formatDateToYMD(d) {
  const year = d.getFullYear();
  const month = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

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
      return res.status(200).json({ success: true, data: existing.albums });
    }

    // 2) Get latest user's insight before the requested date to exclude its albums
    const latest = await Insight.findOne({ user_id: userId, date: { $lt: targetDate } }).sort({ date: -1 }).select('albums');
    const excludeIds = latest && latest.albums ? latest.albums : [];

    // 3) Try to sample 3 random albums excluding the latest albums
    let sampled = [];
    try {
      const match = (excludeIds && excludeIds.length) ? { _id: { $nin: excludeIds } } : {};
      sampled = await Album.aggregate([
        { $match: match },
        { $sample: { size: 3 } }
      ]);
    } catch (e) {
      sampled = [];
    }

    // If not enough results (e.g., excluded too many), sample without exclusion
    if (!sampled || sampled.length < 3) {
      sampled = await Album.aggregate([
        { $sample: { size: 3 } }
      ]);
    }

    // Ensure we have up to 3 unique albums
    const finalAlbums = sampled.slice(0, 3);

    // Save insight record
    const albumIds = finalAlbums.map(a => a._id);

    const newInsight = new Insight({
      user_id: userId,
      date: targetDate,
      albums: albumIds
    });

    await newInsight.save();

    return res.status(200).json({ success: true, data: finalAlbums });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: 'Server Error' });
  }
};