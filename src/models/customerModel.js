const db = require('../config/database');
const mongooseSchemas = require('./mongoose/schemas');

class CustomerModel {
  static async findAll({ page = 1, limit = 10, search = '' }) {
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 10);
    const offset = (pageNum - 1) * limitNum;

    if (db.isMongoConnected) {
      const filter = {};
      if (search) {
        filter.$or = [
          { first_name: { $regex: search, $options: 'i' } },
          { last_name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ];
      }
      const [data, total] = await Promise.all([
        mongooseSchemas.Customer.find(filter).skip(offset).limit(limitNum).lean(),
        mongooseSchemas.Customer.countDocuments(filter)
      ]);
      return {
        data,
        meta: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) || 1 }
      };
    }

    let baseQuery = `
      SELECT c.*, a.address, a.phone, ci.city, co.country
      FROM customer c
      LEFT JOIN address a ON c.address_id = a.address_id
      LEFT JOIN city ci ON a.city_id = ci.city_id
      LEFT JOIN country co ON ci.country_id = co.country_id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      baseQuery += ` AND (c.first_name LIKE ? OR c.last_name LIKE ? OR c.email LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const countRow = db.prepare(`SELECT COUNT(*) AS total FROM (${baseQuery})`).get(...params);
    const total = countRow ? countRow.total : 0;

    baseQuery += ` ORDER BY c.customer_id DESC LIMIT ? OFFSET ?`;
    const customers = db.prepare(baseQuery).all(...params, limitNum, offset);

    return {
      data: customers,
      meta: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) || 1 }
    };
  }

  static async findById(id) {
    if (db.isMongoConnected) {
      return mongooseSchemas.Customer.findOne({ customer_id: Number(id) }).lean();
    }

    const customer = db.prepare(`
      SELECT c.*, a.address, a.address2, a.district, a.postal_code, a.phone, ci.city, co.country
      FROM customer c
      LEFT JOIN address a ON c.address_id = a.address_id
      LEFT JOIN city ci ON a.city_id = ci.city_id
      LEFT JOIN country co ON ci.country_id = co.country_id
      WHERE c.customer_id = ?
    `).get(id);

    if (!customer) return null;

    const rentals = db.prepare(`
      SELECT r.*, f.title AS film_title, p.amount
      FROM rental r
      JOIN inventory i ON r.inventory_id = i.inventory_id
      JOIN film f ON i.film_id = f.film_id
      LEFT JOIN payment p ON r.rental_id = p.rental_id
      WHERE r.customer_id = ?
      ORDER BY r.rental_date DESC
    `).all(id);

    return { ...customer, rentals };
  }

  static async create({ store_id = 1, first_name, last_name, email, address_id = 1 }) {
    if (db.isMongoConnected) {
      const count = await mongooseSchemas.Customer.countDocuments();
      const newCustomer = await mongooseSchemas.Customer.create({
        customer_id: count + 1,
        store_id,
        first_name: first_name.toUpperCase(),
        last_name: last_name.toUpperCase(),
        email,
        address_id
      });
      return newCustomer.toObject();
    }

    const stmt = db.prepare(`
      INSERT INTO customer (store_id, first_name, last_name, email, address_id, activebool, active)
      VALUES (?, ?, ?, ?, ?, 1, 1)
    `);
    const result = stmt.run(store_id, first_name.toUpperCase(), last_name.toUpperCase(), email, address_id);
    return this.findById(result.lastInsertRowid);
  }

  static async update(id, data) {
    if (db.isMongoConnected) {
      return mongooseSchemas.Customer.findOneAndUpdate(
        { customer_id: Number(id) },
        { $set: data },
        { new: true }
      ).lean();
    }

    const existing = await this.findById(id);
    if (!existing) return null;

    const updated = { ...existing, ...data };
    const stmt = db.prepare(`
      UPDATE customer SET
        store_id = ?, first_name = ?, last_name = ?, email = ?,
        address_id = ?, active = ?, last_update = CURRENT_TIMESTAMP
      WHERE customer_id = ?
    `);

    stmt.run(
      updated.store_id, updated.first_name.toUpperCase(),
      updated.last_name.toUpperCase(), updated.email,
      updated.address_id, updated.active, id
    );

    return this.findById(id);
  }

  static async delete(id) {
    if (db.isMongoConnected) {
      const res = await mongooseSchemas.Customer.deleteOne({ customer_id: Number(id) });
      return res.deletedCount > 0;
    }

    const stmt = db.prepare('DELETE FROM customer WHERE customer_id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }
}

module.exports = CustomerModel;
