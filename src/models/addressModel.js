const db = require('../config/database');

/**
 * Address Data Model
 */
class AddressModel {
  static findAll({ page = 1, limit = 10 }) {
    const offset = (page - 1) * limit;

    const countRow = db.prepare('SELECT COUNT(*) AS total FROM address').get();
    const total = countRow ? countRow.total : 0;

    const addresses = db.prepare(`
      SELECT a.*, ci.city, co.country
      FROM address a
      LEFT JOIN city ci ON a.city_id = ci.city_id
      LEFT JOIN country co ON ci.country_id = co.country_id
      ORDER BY a.address_id DESC
      LIMIT ? OFFSET ?
    `).all(limit, offset);

    return {
      data: addresses,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  static findById(id) {
    return db.prepare(`
      SELECT a.*, ci.city, co.country
      FROM address a
      LEFT JOIN city ci ON a.city_id = ci.city_id
      LEFT JOIN country co ON ci.country_id = co.country_id
      WHERE a.address_id = ?
    `).get(id);
  }

  static create({ address, address2 = null, district, city_id = 1, postal_code = null, phone }) {
    const stmt = db.prepare(`
      INSERT INTO address (address, address2, district, city_id, postal_code, phone)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(address, address2, district, city_id, postal_code, phone);
    return this.findById(result.lastInsertRowid);
  }
}

module.exports = AddressModel;
