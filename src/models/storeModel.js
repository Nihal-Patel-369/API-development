const db = require('../config/database');
const mongooseSchemas = require('./mongoose/schemas');

class StoreModel {
  static async findAll() {
    if (db.isMongoConnected) {
      return mongooseSchemas.Store.find().lean();
    }
    return db.prepare(`
      SELECT s.*,
             st.first_name || ' ' || st.last_name AS manager_name,
             a.address, ci.city, co.country
      FROM store s
      LEFT JOIN staff st ON s.manager_staff_id = st.staff_id
      LEFT JOIN address a ON s.address_id = a.address_id
      LEFT JOIN city ci ON a.city_id = ci.city_id
      LEFT JOIN country co ON ci.country_id = co.country_id
    `).all();
  }
}

module.exports = StoreModel;
