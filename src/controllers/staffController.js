const StaffModel = require('../models/staffModel');

exports.getAllStaff = async (req, res, next) => {
  try {
    const staff = await StaffModel.findAll();
    res.json({
      status: 'success',
      data: staff
    });
  } catch (error) {
    next(error);
  }
};

exports.getStaffById = async (req, res, next) => {
  try {
    const member = await StaffModel.findById(req.params.id);
    if (!member) {
      return res.status(404).json({
        status: 'fail',
        message: `Staff member ${req.params.id} not found`
      });
    }
    res.json({
      status: 'success',
      data: member
    });
  } catch (error) {
    next(error);
  }
};
