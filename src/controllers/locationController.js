const LocationModel = require('../models/locationModel');

exports.getCities = (req, res, next) => {
  try {
    const cities = LocationModel.findAllCities();
    res.json({
      status: 'success',
      data: cities
    });
  } catch (error) {
    next(error);
  }
};

exports.getCountries = (req, res, next) => {
  try {
    const countries = LocationModel.findAllCountries();
    res.json({
      status: 'success',
      data: countries
    });
  } catch (error) {
    next(error);
  }
};
