const db = require('../config/database');

/**
 * Language Model
 */
class LanguageModel {
  static findAll() {
    return db.prepare('SELECT * FROM language ORDER BY name ASC').all();
  }
}

module.exports = LanguageModel;
