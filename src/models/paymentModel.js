const db = require('../config/database');
const mongooseSchemas = require('./mongoose/schemas');

class PaymentModel {
  static async findAll({ page = 1, limit = 10 }) {
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 10);
    const offset = (pageNum - 1) * limitNum;

    if (db.isMongoConnected) {
      const [data, total] = await Promise.all([
        mongooseSchemas.Payment.find().skip(offset).limit(limitNum).lean(),
        mongooseSchemas.Payment.countDocuments()
      ]);
      return {
        data,
        meta: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) || 1 }
      };
    }

    const countRow = db.prepare('SELECT COUNT(*) AS total FROM payment').get();
    const total = countRow ? countRow.total : 0;

    const payments = db.prepare(`
      SELECT p.*, c.first_name || ' ' || c.last_name AS customer_name, s.first_name || ' ' || s.last_name AS staff_name
      FROM payment p
      JOIN customer c ON p.customer_id = c.customer_id
      JOIN staff s ON p.staff_id = s.staff_id
      ORDER BY p.payment_id DESC
      LIMIT ? OFFSET ?
    `).all(limitNum, offset);

    return {
      data: payments,
      meta: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) || 1 }
    };
  }

  static async create({ customer_id, staff_id = 1, rental_id = null, amount }) {
    if (db.isMongoConnected) {
      const count = await mongooseSchemas.Payment.countDocuments();
      const newPayment = await mongooseSchemas.Payment.create({
        payment_id: count + 1,
        customer_id,
        staff_id,
        rental_id,
        amount
      });
      return newPayment.toObject();
    }

    const stmt = db.prepare(`
      INSERT INTO payment (customer_id, staff_id, rental_id, amount)
      VALUES (?, ?, ?, ?)
    `);
    const result = stmt.run(customer_id, staff_id, rental_id, amount);
    return db.prepare('SELECT * FROM payment WHERE payment_id = ?').get(result.lastInsertRowid);
  }
}

module.exports = PaymentModel;
