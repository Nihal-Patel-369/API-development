const db = require('../config/database');
const mongooseSchemas = require('./mongoose/schemas');

class StaffModel {
  static async findAll() {
    if (db.isMongoConnected) {
      return mongooseSchemas.Staff.find().lean();
    }
    return db.prepare(`
      SELECT s.staff_id, s.first_name, s.last_name, s.email, s.username, s.active,
             s.store_id, a.address, a.phone, ci.city, co.country
      FROM staff s
      LEFT JOIN address a ON s.address_id = a.address_id
      LEFT JOIN city ci ON a.city_id = ci.city_id
      LEFT JOIN country co ON ci.country_id = co.country_id
      ORDER BY s.staff_id ASC
    `).all();
  }

  static async findById(id) {
    if (db.isMongoConnected) {
      return mongooseSchemas.Staff.findOne({ staff_id: Number(id) }).lean();
    }
    return db.prepare(`
      SELECT s.staff_id, s.first_name, s.last_name, s.email, s.username, s.active,
             s.store_id, a.address, a.phone, ci.city, co.country
      FROM staff s
      LEFT JOIN address a ON s.address_id = a.address_id
      LEFT JOIN city ci ON a.city_id = ci.city_id
      LEFT JOIN country co ON ci.country_id = co.country_id
      WHERE s.staff_id = ?
    `).get(id);
  }
}

module.exports = StaffModel;
