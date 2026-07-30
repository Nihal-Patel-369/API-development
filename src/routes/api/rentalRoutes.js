const express = require('express');
const router = express.Router();
const rentalController = require('../../controllers/rentalController');

router.route('/')
  .get(rentalController.getAllRentals)
  .post(rentalController.createRental);

router.route('/:id')
  .get(rentalController.getRentalById);

router.patch('/:id/return', rentalController.returnRental);

module.exports = router;
