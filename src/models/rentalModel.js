const db = require('../config/database');
const mongooseSchemas = require('./mongoose/schemas');

class RentalModel {
  static async findAll({ page = 1, limit = 10 }) {
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 10);
    const offset = (pageNum - 1) * limitNum;

    if (db.isMongoConnected) {
      const [data, total] = await Promise.all([
        mongooseSchemas.Rental.find().skip(offset).limit(limitNum).lean(),
        mongooseSchemas.Rental.countDocuments()
      ]);
      return {
        data,
        meta: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) || 1 }
      };
    }

    const countRow = db.prepare('SELECT COUNT(*) AS total FROM rental').get();
    const total = countRow ? countRow.total : 0;

    const rentals = db.prepare(`
      SELECT r.*,
             c.first_name || ' ' || c.last_name AS customer_name,
             f.title AS film_title,
             s.first_name || ' ' || s.last_name AS staff_name
      FROM rental r
      JOIN customer c ON r.customer_id = c.customer_id
      JOIN inventory i ON r.inventory_id = i.inventory_id
      JOIN film f ON i.film_id = f.film_id
      JOIN staff s ON r.staff_id = s.staff_id
      ORDER BY r.rental_id DESC
      LIMIT ? OFFSET ?
    `).all(limitNum, offset);

    return {
      data: rentals,
      meta: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) || 1 }
    };
  }

  static async findById(id) {
    if (db.isMongoConnected) {
      return mongooseSchemas.Rental.findOne({ rental_id: Number(id) }).lean();
    }

    return db.prepare(`
      SELECT r.*,
             c.first_name || ' ' || c.last_name AS customer_name,
             f.title AS film_title,
             f.rental_rate,
             s.first_name || ' ' || s.last_name AS staff_name
      FROM rental r
      JOIN customer c ON r.customer_id = c.customer_id
      JOIN inventory i ON r.inventory_id = i.inventory_id
      JOIN film f ON i.film_id = f.film_id
      JOIN staff s ON r.staff_id = s.staff_id
      WHERE r.rental_id = ?
    `).get(id);
  }

  static async create({ inventory_id, customer_id, staff_id = 1, rental_period = '7 days' }) {
    if (db.isMongoConnected) {
      const count = await mongooseSchemas.Rental.countDocuments();
      const newRental = await mongooseSchemas.Rental.create({
        rental_id: count + 1,
        inventory_id,
        customer_id,
        staff_id,
        rental_period
      });
      return newRental.toObject();
    }

    const stmt = db.prepare(`
      INSERT INTO rental (inventory_id, customer_id, staff_id, rental_period)
      VALUES (?, ?, ?, ?)
    `);
    const result = stmt.run(inventory_id, customer_id, staff_id, rental_period);
    return this.findById(result.lastInsertRowid);
  }

  static async returnFilm(id) {
    if (db.isMongoConnected) {
      return mongooseSchemas.Rental.findOneAndUpdate(
        { rental_id: Number(id) },
        { $set: { return_date: new Date(), last_update: new Date() } },
        { new: true }
      ).lean();
    }

    const stmt = db.prepare(`
      UPDATE rental SET return_date = CURRENT_TIMESTAMP, last_update = CURRENT_TIMESTAMP
      WHERE rental_id = ?
    `);
    stmt.run(id);
    return this.findById(id);
  }
}

module.exports = RentalModel;
