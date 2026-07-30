const db = require('../config/database');
const mongooseSchemas = require('../models/mongoose/schemas');
const fs = require('fs');
const path = require('path');

async function seed() {
  console.log('🌱 Starting Pagila Database Seeding...');
  await db.init();

  // Seed MongoDB if connected
  if (db.isMongoConnected) {
    console.log('🍃 Seeding MongoDB Collections...');
    const { Film, Actor, Customer, Rental, Payment, Category, Language, Country, City, Address, Store, Staff } = mongooseSchemas;

    await Promise.all([
      Film.deleteMany({}), Actor.deleteMany({}), Customer.deleteMany({}),
      Rental.deleteMany({}), Payment.deleteMany({}), Category.deleteMany({}),
      Language.deleteMany({}), Country.deleteMany({}), City.deleteMany({}),
      Address.deleteMany({}), Store.deleteMany({}), Staff.deleteMany({})
    ]);

    await Country.insertMany([
      { country_id: 1, country: 'United States' },
      { country_id: 2, country: 'United Kingdom' },
      { country_id: 3, country: 'Canada' },
      { country_id: 4, country: 'Japan' },
      { country_id: 5, country: 'Germany' }
    ]);

    await City.insertMany([
      { city_id: 1, city: 'New York', country_id: 1 },
      { city_id: 2, city: 'Los Angeles', country_id: 1 },
      { city_id: 3, city: 'London', country_id: 2 }
    ]);

    await Address.insertMany([
      { address_id: 1, address: '47 Myneer Street', district: 'Alberta', city_id: 1, postal_code: '19108', phone: '2830338423' },
      { address_id: 2, address: '28 MySQL Boulevard', district: 'QLD', city_id: 3, postal_code: '35200', phone: '8357849230' }
    ]);

    await Language.insertMany([
      { language_id: 1, name: 'English' },
      { language_id: 2, name: 'Italian' },
      { language_id: 3, name: 'Japanese' }
    ]);

    await Category.insertMany([
      { category_id: 1, name: 'Action' },
      { category_id: 2, name: 'Animation' },
      { category_id: 6, name: 'Documentary' },
      { category_id: 7, name: 'Drama' }
    ]);

    await Actor.insertMany([
      { actor_id: 1, first_name: 'PENELOPE', last_name: 'GUINESS' },
      { actor_id: 2, first_name: 'NICK', last_name: 'WAHLBERG' },
      { actor_id: 3, first_name: 'ED', last_name: 'CHASE' }
    ]);

    await Film.insertMany([
      {
        film_id: 1,
        title: 'ACADEMY DINOSAUR',
        description: 'A Epic Drama of a Feminist And a Mad Scientist who must Battle a Teacher in The Canadian Rockies',
        release_year: 2006,
        language_id: 1,
        rental_duration: 6,
        rental_rate: 0.99,
        length: 86,
        replacement_cost: 20.99,
        rating: 'PG',
        special_features: 'Deleted Scenes,Behind the Scenes',
        categories: [6],
        actors: [1]
      },
      {
        film_id: 2,
        title: 'ACE GOLDFINGER',
        description: 'A Astounding Epistle of a Database Administrator And a Explorer who must Find a Car in Ancient Japan',
        release_year: 2006,
        language_id: 1,
        rental_duration: 3,
        rental_rate: 4.99,
        length: 48,
        replacement_cost: 12.99,
        rating: 'G',
        special_features: 'Trailers,Commentaries',
        categories: [2],
        actors: [2]
      }
    ]);

    await Store.insertMany([
      { store_id: 1, manager_staff_id: 1, address_id: 1 },
      { store_id: 2, manager_staff_id: 2, address_id: 2 }
    ]);

    await Staff.insertMany([
      { staff_id: 1, first_name: 'Mike', last_name: 'Hillyer', address_id: 1, email: 'Mike.Hillyer@pagilastaff.org', store_id: 1, username: 'Mike' },
      { staff_id: 2, first_name: 'Jon', last_name: 'Stephens', address_id: 2, email: 'Jon.Stephens@pagilastaff.org', store_id: 2, username: 'Jon' }
    ]);

    await Customer.insertMany([
      { customer_id: 1, store_id: 1, first_name: 'MARY', last_name: 'SMITH', email: 'MARY.SMITH@pagilacustomer.org', address_id: 1, activebool: true, active: 1 },
      { customer_id: 2, store_id: 2, first_name: 'PATRICIA', last_name: 'JOHNSON', email: 'PATRICIA.JOHNSON@pagilacustomer.org', address_id: 2, activebool: true, active: 1 }
    ]);

    await Rental.insertMany([
      { rental_id: 1, rental_date: new Date('2026-07-01'), inventory_id: 1, film_id: 1, customer_id: 1, staff_id: 1, rental_period: '7 days' }
    ]);

    await Payment.insertMany([
      { payment_id: 1, customer_id: 1, staff_id: 1, rental_id: 1, amount: 2.99, payment_date: new Date('2026-07-01') }
    ]);

    console.log('✅ MongoDB Seeding Completed Successfully!');
  }

  // Seed SQLite
  if (db.db) {
    console.log('⚡ Seeding SQLite Engine...');
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    db.exec('PRAGMA foreign_keys = OFF;');
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").all();
    tables.forEach(t => db.exec(`DROP TABLE IF EXISTS ${t.name}`));
    db.exec('PRAGMA foreign_keys = ON;');

    db.exec(schemaSql);

    db.prepare('INSERT INTO country (country) VALUES (?)').run('United States');
    db.prepare('INSERT INTO country (country) VALUES (?)').run('United Kingdom');
    db.prepare('INSERT INTO city (city, country_id) VALUES (?, ?)').run('New York', 1);
    db.prepare('INSERT INTO address (address, district, city_id, phone) VALUES (?, ?, ?, ?)').run('47 Myneer Street', 'Alberta', 1, '2830338423');
    db.prepare('INSERT INTO store (address_id) VALUES (?)').run(1);
    db.prepare('INSERT INTO staff (first_name, last_name, address_id, email, store_id, username) VALUES (?, ?, ?, ?, ?, ?)').run('Mike', 'Hillyer', 1, 'Mike.Hillyer@pagilastaff.org', 1, 'Mike');
    db.prepare('INSERT INTO language (name) VALUES (?)').run('English');
    db.prepare('INSERT INTO category (name) VALUES (?)').run('Action');
    db.prepare('INSERT INTO actor (first_name, last_name) VALUES (?, ?)').run('PENELOPE', 'GUINESS');
    db.prepare('INSERT INTO film (title, description, release_year, language_id, rating) VALUES (?, ?, ?, ?, ?)').run('ACADEMY DINOSAUR', 'A Epic Drama', 2006, 1, 'PG');
    db.prepare('INSERT INTO customer (store_id, first_name, last_name, email, address_id) VALUES (?, ?, ?, ?, ?)').run(1, 'MARY', 'SMITH', 'MARY.SMITH@pagilacustomer.org', 1);

    console.log('✅ SQLite Seeding Completed Successfully!');
  }
}

seed().catch(console.error);
