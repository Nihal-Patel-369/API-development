const mongoose = require('mongoose');
const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const dbPath = path.resolve(process.env.DB_PATH || './src/db/pagila.db');
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pagila_db';

// Ensure database directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

let SQL;

function saveDatabase(dbInstance) {
  if (dbInstance) {
    const data = dbInstance.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
  }
}

function loadDatabase() {
  let filebuffer;
  if (fs.existsSync(dbPath)) {
    filebuffer = fs.readFileSync(dbPath);
  }
  return new SQL.Database(filebuffer);
}

class DatabaseWrapper {
  constructor() {
    this.db = null;
    this.type = 'sqlite'; // 'sqlite' or 'mongodb'
    this.isMongoConnected = false;
  }

  async init() {
    // Try MongoDB connection if requested
    if (process.env.DB_TYPE === 'mongodb' || process.env.DB_TYPE === 'auto') {
      try {
        console.log(`🔌 Attempting MongoDB connection: ${mongoUri}...`);
        await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2500 });
        this.type = 'mongodb';
        this.isMongoConnected = true;
        console.log('✅ Connected to MongoDB successfully.');
        return;
      } catch (mongoErr) {
        console.log('ℹ️ MongoDB server not active or offline. Falling back to offline SQLite engine.');
        this.type = 'sqlite';
        this.isMongoConnected = false;
      }
    }

    // SQLite Initialization
    if (!this.db) {
      SQL = await initSqlJs();
      this.db = loadDatabase();
      this.db.run('PRAGMA foreign_keys = ON;');

      const tableCheck = this.db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name='film'");
      if (!tableCheck.length || !tableCheck[0].values.length) {
        console.log('📦 Auto-initializing schema & seed data...');
        const schemaPath = path.join(__dirname, '../db/schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        this.db.run(schemaSql);
        saveDatabase(this.db);
      }
    }
  }

  exec(sql) {
    if (this.db) {
      this.db.run(sql);
      saveDatabase(this.db);
    }
  }

  prepare(sql) {
    const self = this;
    return {
      all(...params) {
        const stmt = self.db.prepare(sql);
        stmt.bind(params);
        const results = [];
        while (stmt.step()) {
          results.push(stmt.getAsObject());
        }
        stmt.free();
        return results;
      },

      get(...params) {
        const stmt = self.db.prepare(sql);
        stmt.bind(params);
        let result = null;
        if (stmt.step()) {
          result = stmt.getAsObject();
        }
        stmt.free();
        return result;
      },

      run(...params) {
        self.db.run(sql, params);
        const lastIdResult = self.db.exec("SELECT last_insert_rowid() AS id");
        const changesResult = self.db.exec("SELECT changes() AS count");
        
        saveDatabase(self.db);

        const lastInsertRowid = (lastIdResult[0] && lastIdResult[0].values[0]) ? lastIdResult[0].values[0][0] : 0;
        const changes = (changesResult[0] && changesResult[0].values[0]) ? changesResult[0].values[0][0] : 0;

        return {
          lastInsertRowid,
          changes
        };
      }
    };
  }
}

const db = new DatabaseWrapper();

module.exports = db;
