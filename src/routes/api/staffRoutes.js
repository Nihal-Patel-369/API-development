const express = require('express');
const router = express.Router();
const staffController = require('../../controllers/staffController');

router.get('/', staffController.getAllStaff);
router.get('/:id', staffController.getStaffById);

module.exports = router;
