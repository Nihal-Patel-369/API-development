const PaymentModel = require('../models/paymentModel');

exports.getAllPayments = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const result = await PaymentModel.findAll({ page, limit });
    res.json({
      status: 'success',
      ...result
    });
  } catch (error) {
    next(error);
  }
};

exports.createPayment = async (req, res, next) => {
  try {
    const { customer_id, amount } = req.body;
    if (!customer_id || !amount) {
      return res.status(400).json({
        status: 'fail',
        message: 'customer_id and amount are required'
      });
    }
    const payment = await PaymentModel.create(req.body);
    res.status(201).json({
      status: 'success',
      data: payment
    });
  } catch (error) {
    next(error);
  }
};
