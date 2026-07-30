const db = require('../config/database');

/**
 * Location Model (Cities and Countries)
 */
class LocationModel {
  static findAllCities() {
    return db.prepare(`
      SELECT ci.*, co.country
      FROM city ci
      JOIN country co ON ci.country_id = co.country_id
      ORDER BY ci.city ASC
    `).all();
  }

  static findAllCountries() {
    return db.prepare('SELECT * FROM country ORDER BY country ASC').all();
  }
}

module.exports = LocationModel;
