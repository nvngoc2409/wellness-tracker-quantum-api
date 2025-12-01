const Album = require('../models/album.model.js');
const Category = require('../models/category.model.js');
const mongoose = require('mongoose');

/**
 * @desc    Lấy danh sách album có phân trang và lọc theo subcategory hoặc category
 * @route   GET /api/albums
 * @access  Public
 */
exports.getAlbums = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const subcategoryId = req.query.subcategory;
    const categoryId = req.query.category || req.query.categoryId;

    const startIndex = (page - 1) * limit;

    const filter = {};
    if (subcategoryId) {
      filter['subcategories.subcategory'] = subcategoryId;
    }

    // If categoryId is provided, find its subcategories and filter albums
    if (categoryId) {
      // Validate categoryId first
      if (!mongoose.isValidObjectId(categoryId)) {
        return res.status(400).json({ success: false, error: 'Invalid categoryId' });
      }

      const category = await Category.findById(categoryId).select('subcategories.subcategory');

      if (!category || !category.subcategories || category.subcategories.length === 0) {
        // If requested category doesn't exist or has no subcategories, return empty result with pagination
        return res.status(200).json({
          success: true,
          totalAlbums: 0,
          totalPages: 0,
          currentPage: page,
          pagination: {},
          data: []
        });
      }

      // Extract subcategory IDs from the category
      const subcategoryIds = category.subcategories.map(s => s.subcategory);

      // If subcategoryId filter is already set, ensure it belongs to the category
      if (filter['subcategories.subcategory']) {
        const providedSubId = filter['subcategories.subcategory'].toString();
        const belongs = subcategoryIds.some(id => id.toString() === providedSubId);
        if (!belongs) {
          // Provided subcategory doesn't belong to the specified category -> empty result
          return res.status(200).json({
            success: true,
            totalAlbums: 0,
            totalPages: 0,
            currentPage: page,
            pagination: {},
            data: []
          });
        }
      } else {
        filter['subcategories.subcategory'] = { $in: subcategoryIds };
      }
    }

    const [albums, total] = await Promise.all([
      Album.find(filter)
        .populate({
          path: 'subcategories.subcategory',
          select: 'name'
        })
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(startIndex),
      Album.countDocuments(filter)
    ]);

    const pagination = {};

    const totalPages = Math.ceil(total / limit);

    if (page < totalPages) {
      pagination.next = {
        page: page + 1,
        limit: limit
      };
    }

    if (page > 1) {
      pagination.prev = {
        page: page - 1,
        limit: limit
      };
    }

    res.status(200).json({
      success: true,
      totalAlbums: total,
      totalPages: totalPages,
      currentPage: page,
      pagination,
      data: albums
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};