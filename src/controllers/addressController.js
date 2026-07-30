const AddressModel = require('../models/addressModel');

exports.getAllAddresses = (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const result = AddressModel.findAll({ page, limit });
    res.json({
      status: 'success',
      ...result
    });
  } catch (error) {
    next(error);
  }
};

exports.getAddressById = (req, res, next) => {
  try {
    const address = AddressModel.findById(req.params.id);
    if (!address) {
      return res.status(404).json({
        status: 'fail',
        message: `Address ${req.params.id} not found`
      });
    }
    res.json({
      status: 'success',
      data: address
    });
  } catch (error) {
    next(error);
  }
};

exports.createAddress = (req, res, next) => {
  try {
    const { address, district, phone } = req.body;
    if (!address || !district || !phone) {
      return res.status(400).json({
        status: 'fail',
        message: 'address, district, and phone are required'
      });
    }
    const newAddr = AddressModel.create(req.body);
    res.status(201).json({
      status: 'success',
      data: newAddr
    });
  } catch (error) {
    next(error);
  }
};
