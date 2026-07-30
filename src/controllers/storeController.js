const StoreModel = require('../models/storeModel');

exports.getAllStores = async (req, res, next) => {
  try {
    const stores = await StoreModel.findAll();
    res.json({
      status: 'success',
      data: stores
    });
  } catch (error) {
    next(error);
  }
};
