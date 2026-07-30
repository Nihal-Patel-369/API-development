const db = require('../config/database');
const mongooseSchemas = require('./mongoose/schemas');

/**
 * Film Model (MongoDB & SQLite)
 */
class FilmModel {
  static async findAll({ page = 1, limit = 10, search = '', category = '' }) {
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 10);
    const offset = (pageNum - 1) * limitNum;

    if (db.isMongoConnected) {
      const filter = {};
      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }
      const [data, total] = await Promise.all([
        mongooseSchemas.Film.find(filter).skip(offset).limit(limitNum).lean(),
        mongooseSchemas.Film.countDocuments(filter)
      ]);
      return {
        data,
        meta: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum) || 1
        }
      };
    }

    // SQLite Mode
    let baseWhere = ` WHERE 1=1`;
    const params = [];

    if (search) {
      baseWhere += ` AND (f.title LIKE ? OR f.description LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    if (category) {
      baseWhere += ` AND c.name = ?`;
      params.push(category);
    }

    const countQuery = `
      SELECT COUNT(DISTINCT f.film_id) AS total
      FROM film f
      LEFT JOIN film_category fc ON f.film_id = fc.film_id
      LEFT JOIN category c ON fc.category_id = c.category_id
      ${baseWhere}
    `;

    const totalRow = db.prepare(countQuery).get(...params);
    const total = totalRow ? totalRow.total : 0;

    const dataQuery = `
      SELECT f.*, l.name AS language_name, c.name AS category_name
      FROM film f
      LEFT JOIN language l ON f.language_id = l.language_id
      LEFT JOIN film_category fc ON f.film_id = fc.film_id
      LEFT JOIN category c ON fc.category_id = c.category_id
      ${baseWhere}
      GROUP BY f.film_id
      ORDER BY f.film_id DESC
      LIMIT ? OFFSET ?
    `;

    const films = db.prepare(dataQuery).all(...params, limitNum, offset);

    return {
      data: films,
      meta: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum) || 1
      }
    };
  }

  static async findById(id) {
    if (db.isMongoConnected) {
      return mongooseSchemas.Film.findOne({ film_id: Number(id) }).lean();
    }

    const film = db.prepare(`
      SELECT f.*, l.name AS language_name, ol.name AS original_language_name
      FROM film f
      LEFT JOIN language l ON f.language_id = l.language_id
      LEFT JOIN language ol ON f.original_language_id = ol.language_id
      WHERE f.film_id = ?
    `).get(id);

    if (!film) return null;

    const categories = db.prepare(`
      SELECT c.* FROM category c
      JOIN film_category fc ON c.category_id = fc.category_id
      WHERE fc.film_id = ?
    `).all(id);

    const actors = db.prepare(`
      SELECT a.* FROM actor a
      JOIN film_actor fa ON a.actor_id = fa.actor_id
      WHERE fa.film_id = ?
    `).all(id);

    return { ...film, categories, actors };
  }

  static async create(filmData) {
    if (db.isMongoConnected) {
      const count = await mongooseSchemas.Film.countDocuments();
      const newFilm = await mongooseSchemas.Film.create({
        film_id: count + 1,
        ...filmData
      });
      return newFilm.toObject();
    }

    const {
      title, description, release_year, language_id = 1,
      rental_duration = 3, rental_rate = 4.99, length,
      replacement_cost = 19.99, rating = 'PG-13', special_features = ''
    } = filmData;

    const stmt = db.prepare(`
      INSERT INTO film (
        title, description, release_year, language_id,
        rental_duration, rental_rate, length, replacement_cost,
        rating, special_features
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      title, description, release_year, language_id,
      rental_duration, rental_rate, length, replacement_cost,
      rating, special_features
    );

    return this.findById(result.lastInsertRowid);
  }

  static async update(id, filmData) {
    if (db.isMongoConnected) {
      return mongooseSchemas.Film.findOneAndUpdate(
        { film_id: Number(id) },
        { $set: filmData },
        { new: true }
      ).lean();
    }

    const existing = await this.findById(id);
    if (!existing) return null;

    const updated = { ...existing, ...filmData };
    const stmt = db.prepare(`
      UPDATE film SET
        title = ?, description = ?, release_year = ?, language_id = ?,
        rental_duration = ?, rental_rate = ?, length = ?, replacement_cost = ?,
        rating = ?, special_features = ?, last_update = CURRENT_TIMESTAMP
      WHERE film_id = ?
    `);

    stmt.run(
      updated.title, updated.description, updated.release_year, updated.language_id,
      updated.rental_duration, updated.rental_rate, updated.length, updated.replacement_cost,
      updated.rating, updated.special_features, id
    );

    return this.findById(id);
  }

  static async delete(id) {
    if (db.isMongoConnected) {
      const res = await mongooseSchemas.Film.deleteOne({ film_id: Number(id) });
      return res.deletedCount > 0;
    }

    const stmt = db.prepare('DELETE FROM film WHERE film_id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }
}

module.exports = FilmModel;
