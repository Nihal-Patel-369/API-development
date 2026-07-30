const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const db = require('./src/config/database');
const routes = require('./src/routes');
const errorHandler = require('./src/middlewares/errorHandler');

const app = express();
let PORT = process.env.PORT || 3000;

// Enable CORS and HTTP Request Logging
app.use(cors());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parsing middleware for JSON payloads
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount Central REST API Routes
app.use('/', routes);

// Global Error Handler Middleware
app.use(errorHandler);

// Start Pure Backend REST API Server
async function startServer() {
  try {
    await db.init();
    
    const server = app.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(`🚀 Pagila REST API Server running on port ${PORT}`);
      console.log(`⚡ API Base Endpoint: http://localhost:${PORT}/api/v1`);
      console.log(`📬 Import pagila-api.postman_collection.json in Postman`);
      console.log(`=======================================================`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.warn(`⚠️ Port ${PORT} is currently in use. Trying port ${Number(PORT) + 1}...`);
        PORT = Number(PORT) + 1;
        server.listen(PORT);
      } else {
        console.error('Server error:', err);
      }
    });

  } catch (error) {
    console.error('Failed to start server:', error);
  }
}

startServer();
