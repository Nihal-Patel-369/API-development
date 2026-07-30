-- Pagila Database Schema (SQLite Compatible)
-- Based on Pagila ER Diagram

PRAGMA foreign_keys = ON;

-- 1. Country Table
CREATE TABLE IF NOT EXISTS country (
  country_id INTEGER PRIMARY KEY AUTOINCREMENT,
  country TEXT NOT NULL,
  last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. City Table
CREATE TABLE IF NOT EXISTS city (
  city_id INTEGER PRIMARY KEY AUTOINCREMENT,
  city TEXT NOT NULL,
  country_id INTEGER NOT NULL,
  last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (country_id) REFERENCES country(country_id) ON DELETE CASCADE
);

-- 3. Address Table
CREATE TABLE IF NOT EXISTS address (
  address_id INTEGER PRIMARY KEY AUTOINCREMENT,
  address TEXT NOT NULL,
  address2 TEXT,
  district TEXT NOT NULL,
  city_id INTEGER NOT NULL,
  postal_code TEXT,
  phone TEXT NOT NULL,
  last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  temp TIMESTAMP,
  FOREIGN KEY (city_id) REFERENCES city(city_id) ON DELETE CASCADE
);

-- 4. Category Table
CREATE TABLE IF NOT EXISTS category (
  category_id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Language Table
CREATE TABLE IF NOT EXISTS language (
  language_id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Actor Table
CREATE TABLE IF NOT EXISTS actor (
  actor_id INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Film Table
CREATE TABLE IF NOT EXISTS film (
  film_id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  release_year INTEGER,
  language_id INTEGER NOT NULL,
  original_language_id INTEGER,
  rental_duration INTEGER NOT NULL DEFAULT 3,
  rental_rate NUMERIC(4,2) NOT NULL DEFAULT 4.99,
  length INTEGER,
  replacement_cost NUMERIC(5,2) NOT NULL DEFAULT 19.99,
  rating TEXT DEFAULT 'PG-13',
  last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  special_features TEXT,
  fulltext TEXT,
  revenue_projection NUMERIC(5,2) DEFAULT 0.00,
  FOREIGN KEY (language_id) REFERENCES language(language_id),
  FOREIGN KEY (original_language_id) REFERENCES language(language_id)
);

-- 8. Film Actor Junction Table
CREATE TABLE IF NOT EXISTS film_actor (
  actor_id INTEGER NOT NULL,
  film_id INTEGER NOT NULL,
  last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (actor_id, film_id),
  FOREIGN KEY (actor_id) REFERENCES actor(actor_id) ON DELETE CASCADE,
  FOREIGN KEY (film_id) REFERENCES film(film_id) ON DELETE CASCADE
);

-- 9. Film Category Junction Table
CREATE TABLE IF NOT EXISTS film_category (
  film_id INTEGER NOT NULL,
  category_id INTEGER NOT NULL,
  last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (film_id, category_id),
  FOREIGN KEY (film_id) REFERENCES film(film_id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES category(category_id) ON DELETE CASCADE
);

-- 10. Store Table
CREATE TABLE IF NOT EXISTS store (
  store_id INTEGER PRIMARY KEY AUTOINCREMENT,
  manager_staff_id INTEGER,
  address_id INTEGER NOT NULL,
  last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (address_id) REFERENCES address(address_id)
);

-- 11. Staff Table
CREATE TABLE IF NOT EXISTS staff (
  staff_id INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  address_id INTEGER NOT NULL,
  email TEXT,
  store_id INTEGER NOT NULL,
  active BOOLEAN NOT NULL DEFAULT 1,
  username TEXT NOT NULL UNIQUE,
  password TEXT,
  last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  picture BLOB,
  FOREIGN KEY (address_id) REFERENCES address(address_id),
  FOREIGN KEY (store_id) REFERENCES store(store_id)
);

-- 12. Customer Table
CREATE TABLE IF NOT EXISTS customer (
  customer_id INTEGER PRIMARY KEY AUTOINCREMENT,
  store_id INTEGER NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  address_id INTEGER NOT NULL,
  activebool BOOLEAN NOT NULL DEFAULT 1,
  create_date DATE NOT NULL DEFAULT (DATE('now')),
  last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  active INTEGER DEFAULT 1,
  FOREIGN KEY (store_id) REFERENCES store(store_id),
  FOREIGN KEY (address_id) REFERENCES address(address_id)
);

-- 13. Inventory Table
CREATE TABLE IF NOT EXISTS inventory (
  inventory_id INTEGER PRIMARY KEY AUTOINCREMENT,
  film_id INTEGER NOT NULL,
  store_id INTEGER NOT NULL,
  last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (film_id) REFERENCES film(film_id) ON DELETE CASCADE,
  FOREIGN KEY (store_id) REFERENCES store(store_id) ON DELETE CASCADE
);

-- 14. Rental Table
CREATE TABLE IF NOT EXISTS rental (
  rental_id INTEGER PRIMARY KEY AUTOINCREMENT,
  rental_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  inventory_id INTEGER NOT NULL,
  customer_id INTEGER NOT NULL,
  return_date TIMESTAMP,
  staff_id INTEGER NOT NULL,
  last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  rental_period TEXT,
  FOREIGN KEY (inventory_id) REFERENCES inventory(inventory_id),
  FOREIGN KEY (customer_id) REFERENCES customer(customer_id),
  FOREIGN KEY (staff_id) REFERENCES staff(staff_id)
);

-- 15. Payment Table
CREATE TABLE IF NOT EXISTS payment (
  payment_id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id INTEGER NOT NULL,
  staff_id INTEGER NOT NULL,
  rental_id INTEGER,
  amount NUMERIC(5,2) NOT NULL,
  payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customer(customer_id),
  FOREIGN KEY (staff_id) REFERENCES staff(staff_id),
  FOREIGN KEY (rental_id) REFERENCES rental(rental_id)
);
