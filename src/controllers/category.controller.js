const Category = require('../models/category.model.js');
const Album = require('../models/album.model.js');
require('../models/subcategory.model.js');

/**
 * @desc    Lấy tất cả các category và populate các subcategory liên quan
 * @route   GET /api/categories
 * @access  Public
 */
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find()
      .sort({ order_number: 'asc' })
      .populate({
        path: 'subcategories.subcategory',
        model: 'Subcategory',
        select: 'name description cover_image'
      });

    categories.forEach(category => {
      if (category.subcategories) {
        category.subcategories.sort((a, b) => a.order_number - b.order_number);
      }
    });

    // find subcategory ids that are actually used by any album
    const usedSubcategoryIds = await Album.distinct('subcategories.subcategory');
    const usedSet = new Set(usedSubcategoryIds.map(id => String(id)));

    // filter out categories which have no subcategory linked to any album
    const filteredCategories = categories.filter(category => {
      if (!category.subcategories || category.subcategories.length === 0) return false;
      return category.subcategories.some(sc => usedSet.has(String(sc.subcategory._id)));
    });

    res.status(200).json({
      success: true,
      count: filteredCategories.length,
      data: filteredCategories,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};