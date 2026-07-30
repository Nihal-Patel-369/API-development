const CustomerModel = require('../models/customerModel');

exports.getAllCustomers = async (req, res, next) => {
  try {
    const { page, limit, search } = req.query;
    const result = await CustomerModel.findAll({ page, limit, search });
    res.json({
      status: 'success',
      ...result
    });
  } catch (error) {
    next(error);
  }
};

exports.getCustomerById = async (req, res, next) => {
  try {
    const customer = await CustomerModel.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({
        status: 'fail',
        message: `Customer with ID ${req.params.id} not found`
      });
    }
    res.json({
      status: 'success',
      data: customer
    });
  } catch (error) {
    next(error);
  }
};

exports.createCustomer = async (req, res, next) => {
  try {
    const { first_name, last_name } = req.body;
    if (!first_name || !last_name) {
      return res.status(400).json({
        status: 'fail',
        message: 'first_name and last_name are required'
      });
    }
    const customer = await CustomerModel.create(req.body);
    res.status(201).json({
      status: 'success',
      data: customer
    });
  } catch (error) {
    next(error);
  }
};

exports.updateCustomer = async (req, res, next) => {
  try {
    const customer = await CustomerModel.update(req.params.id, req.body);
    if (!customer) {
      return res.status(404).json({
        status: 'fail',
        message: `Customer with ID ${req.params.id} not found`
      });
    }
    res.json({
      status: 'success',
      data: customer
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteCustomer = async (req, res, next) => {
  try {
    const deleted = await CustomerModel.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        status: 'fail',
        message: `Customer with ID ${req.params.id} not found`
      });
    }
    res.json({
      status: 'success',
      message: `Customer ${req.params.id} deleted successfully`
    });
  } catch (error) {
    next(error);
  }
};
