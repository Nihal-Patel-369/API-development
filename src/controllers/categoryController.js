const CategoryModel = require('../models/categoryModel');

exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await CategoryModel.findAll();
    res.json({
      status: 'success',
      data: categories
    });
  } catch (error) {
    next(error);
  }
};
