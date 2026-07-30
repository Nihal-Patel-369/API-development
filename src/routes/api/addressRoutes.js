const express = require('express');
const router = express.Router();
const addressController = require('../../controllers/addressController');

router.route('/')
  .get(addressController.getAllAddresses)
  .post(addressController.createAddress);

router.get('/:id', addressController.getAddressById);

module.exports = router;
