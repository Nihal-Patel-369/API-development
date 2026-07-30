const RentalModel = require('../models/rentalModel');

exports.getAllRentals = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const result = await RentalModel.findAll({ page, limit });
    res.json({
      status: 'success',
      ...result
    });
  } catch (error) {
    next(error);
  }
};

exports.getRentalById = async (req, res, next) => {
  try {
    const rental = await RentalModel.findById(req.params.id);
    if (!rental) {
      return res.status(404).json({
        status: 'fail',
        message: `Rental ${req.params.id} not found`
      });
    }
    res.json({
      status: 'success',
      data: rental
    });
  } catch (error) {
    next(error);
  }
};

exports.createRental = async (req, res, next) => {
  try {
    const { inventory_id, customer_id } = req.body;
    if (!inventory_id || !customer_id) {
      return res.status(400).json({
        status: 'fail',
        message: 'inventory_id and customer_id are required'
      });
    }
    const rental = await RentalModel.create(req.body);
    res.status(201).json({
      status: 'success',
      data: rental
    });
  } catch (error) {
    next(error);
  }
};

exports.returnRental = async (req, res, next) => {
  try {
    const rental = await RentalModel.returnFilm(req.params.id);
    if (!rental) {
      return res.status(404).json({
        status: 'fail',
        message: `Rental ${req.params.id} not found`
      });
    }
    res.json({
      status: 'success',
      message: 'Rental returned successfully',
      data: rental
    });
  } catch (error) {
    next(error);
  }
};
