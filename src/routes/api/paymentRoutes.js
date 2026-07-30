const express = require('express');
const router = express.Router();
const paymentController = require('../../controllers/paymentController');

router.route('/')
  .get(paymentController.getAllPayments)
  .post(paymentController.createPayment);

module.exports = router;
