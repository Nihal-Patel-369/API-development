const db = require('../config/database');
const mongooseSchemas = require('./mongoose/schemas');

class ActorModel {
  static async findAll({ page = 1, limit = 10, search = '' }) {
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 10);
    const offset = (pageNum - 1) * limitNum;

    if (db.isMongoConnected) {
      const filter = {};
      if (search) {
        filter.$or = [
          { first_name: { $regex: search, $options: 'i' } },
          { last_name: { $regex: search, $options: 'i' } }
        ];
      }
      const [data, total] = await Promise.all([
        mongooseSchemas.Actor.find(filter).skip(offset).limit(limitNum).lean(),
        mongooseSchemas.Actor.countDocuments(filter)
      ]);
      return {
        data,
        meta: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) || 1 }
      };
    }

    let baseQuery = `SELECT * FROM actor WHERE 1=1`;
    const params = [];
    if (search) {
      baseQuery += ` AND (first_name LIKE ? OR last_name LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }
    const countRow = db.prepare(`SELECT COUNT(*) AS total FROM (${baseQuery})`).get(...params);
    const total = countRow ? countRow.total : 0;

    baseQuery += ` ORDER BY actor_id DESC LIMIT ? OFFSET ?`;
    const actors = db.prepare(baseQuery).all(...params, limitNum, offset);

    return {
      data: actors,
      meta: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) || 1 }
    };
  }

  static async findById(id) {
    if (db.isMongoConnected) {
      return mongooseSchemas.Actor.findOne({ actor_id: Number(id) }).lean();
    }
    const actor = db.prepare('SELECT * FROM actor WHERE actor_id = ?').get(id);
    if (!actor) return null;

    const films = db.prepare(`
      SELECT f.film_id, f.title, f.release_year, f.rating
      FROM film f
      JOIN film_actor fa ON f.film_id = fa.film_id
      WHERE fa.actor_id = ?
    `).all(id);

    return { ...actor, films };
  }

  static async create({ first_name, last_name }) {
    if (db.isMongoConnected) {
      const count = await mongooseSchemas.Actor.countDocuments();
      const newActor = await mongooseSchemas.Actor.create({
        actor_id: count + 1,
        first_name: first_name.toUpperCase(),
        last_name: last_name.toUpperCase()
      });
      return newActor.toObject();
    }
    const stmt = db.prepare('INSERT INTO actor (first_name, last_name) VALUES (?, ?)');
    const result = stmt.run(first_name.toUpperCase(), last_name.toUpperCase());
    return this.findById(result.lastInsertRowid);
  }

  static async update(id, { first_name, last_name }) {
    if (db.isMongoConnected) {
      return mongooseSchemas.Actor.findOneAndUpdate(
        { actor_id: Number(id) },
        { $set: { first_name: first_name.toUpperCase(), last_name: last_name.toUpperCase() } },
        { new: true }
      ).lean();
    }
    const stmt = db.prepare('UPDATE actor SET first_name = ?, last_name = ?, last_update = CURRENT_TIMESTAMP WHERE actor_id = ?');
    stmt.run(first_name.toUpperCase(), last_name.toUpperCase(), id);
    return this.findById(id);
  }

  static async delete(id) {
    if (db.isMongoConnected) {
      const res = await mongooseSchemas.Actor.deleteOne({ actor_id: Number(id) });
      return res.deletedCount > 0;
    }
    const stmt = db.prepare('DELETE FROM actor WHERE actor_id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }
}

module.exports = ActorModel;
