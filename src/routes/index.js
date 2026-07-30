const express = require('express');
const router = express.Router();

const filmRoutes = require('./api/filmRoutes');
const actorRoutes = require('./api/actorRoutes');
const customerRoutes = require('./api/customerRoutes');
const rentalRoutes = require('./api/rentalRoutes');
const paymentRoutes = require('./api/paymentRoutes');
const categoryRoutes = require('./api/categoryRoutes');
const storeRoutes = require('./api/storeRoutes');
const staffRoutes = require('./api/staffRoutes');
const addressRoutes = require('./api/addressRoutes');
const locationRoutes = require('./api/locationRoutes');
const languageRoutes = require('./api/languageRoutes');

// Root API Welcome Response
router.get('/', (req, res) => {
  res.json({
    name: 'Pagila Backend REST API',
    version: '1.0.0',
    status: 'active',
    database: 'MongoDB & SQLite Offline Engine',
    postmanCollection: 'pagila-api.postman_collection.json',
    endpoints: {
      films: '/api/v1/films',
      actors: '/api/v1/actors',
      customers: '/api/v1/customers',
      rentals: '/api/v1/rentals',
      payments: '/api/v1/payments',
      categories: '/api/v1/categories',
      stores: '/api/v1/stores',
      staff: '/api/v1/staff',
      addresses: '/api/v1/addresses',
      cities: '/api/v1/locations/cities',
      countries: '/api/v1/locations/countries',
      languages: '/api/v1/languages'
    }
  });
});

// Mount REST API v1 Routes
router.use('/api/v1/films', filmRoutes);
router.use('/api/v1/actors', actorRoutes);
router.use('/api/v1/customers', customerRoutes);
router.use('/api/v1/rentals', rentalRoutes);
router.use('/api/v1/payments', paymentRoutes);
router.use('/api/v1/categories', categoryRoutes);
router.use('/api/v1/stores', storeRoutes);
router.use('/api/v1/staff', staffRoutes);
router.use('/api/v1/addresses', addressRoutes);
router.use('/api/v1/locations', locationRoutes);
router.use('/api/v1/languages', languageRoutes);

module.exports = router;
