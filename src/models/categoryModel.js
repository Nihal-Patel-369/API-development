const db = require('../config/database');
const mongooseSchemas = require('./mongoose/schemas');

class CategoryModel {
  static async findAll() {
    if (db.isMongoConnected) {
      return mongooseSchemas.Category.find().lean();
    }
    return db.prepare(`
      SELECT c.*, COUNT(fc.film_id) AS film_count
      FROM category c
      LEFT JOIN film_category fc ON c.category_id = fc.category_id
      GROUP BY c.category_id
      ORDER BY c.name ASC
    `).all();
  }
}

module.exports = CategoryModel;
