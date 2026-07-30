const mongoose = require('mongoose');

// 1. Country Schema
const CountrySchema = new mongoose.Schema({
  country_id: { type: Number, required: true, unique: true },
  country: { type: String, required: true },
  last_update: { type: Date, default: Date.now }
});

// 2. City Schema
const CitySchema = new mongoose.Schema({
  city_id: { type: Number, required: true, unique: true },
  city: { type: String, required: true },
  country_id: { type: Number, required: true, ref: 'Country' },
  last_update: { type: Date, default: Date.now }
});

// 3. Address Schema
const AddressSchema = new mongoose.Schema({
  address_id: { type: Number, required: true, unique: true },
  address: { type: String, required: true },
  address2: { type: String },
  district: { type: String, required: true },
  city_id: { type: Number, required: true, ref: 'City' },
  postal_code: { type: String },
  phone: { type: String, required: true },
  last_update: { type: Date, default: Date.now }
});

// 4. Category Schema
const CategorySchema = new mongoose.Schema({
  category_id: { type: Number, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  last_update: { type: Date, default: Date.now }
});

// 5. Language Schema
const LanguageSchema = new mongoose.Schema({
  language_id: { type: Number, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  last_update: { type: Date, default: Date.now }
});

// 6. Actor Schema
const ActorSchema = new mongoose.Schema({
  actor_id: { type: Number, required: true, unique: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  last_update: { type: Date, default: Date.now }
});

// 7. Film Schema
const FilmSchema = new mongoose.Schema({
  film_id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String },
  release_year: { type: Number },
  language_id: { type: Number, required: true, ref: 'Language' },
  original_language_id: { type: Number, ref: 'Language' },
  rental_duration: { type: Number, default: 3 },
  rental_rate: { type: Number, default: 4.99 },
  length: { type: Number },
  replacement_cost: { type: Number, default: 19.99 },
  rating: { type: String, default: 'PG-13' },
  special_features: { type: String },
  categories: [{ type: Number, ref: 'Category' }],
  actors: [{ type: Number, ref: 'Actor' }],
  last_update: { type: Date, default: Date.now }
});

// 8. Store Schema
const StoreSchema = new mongoose.Schema({
  store_id: { type: Number, required: true, unique: true },
  manager_staff_id: { type: Number },
  address_id: { type: Number, required: true, ref: 'Address' },
  last_update: { type: Date, default: Date.now }
});

// 9. Staff Schema
const StaffSchema = new mongoose.Schema({
  staff_id: { type: Number, required: true, unique: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  address_id: { type: Number, required: true, ref: 'Address' },
  email: { type: String },
  store_id: { type: Number, required: true, ref: 'Store' },
  active: { type: Boolean, default: true },
  username: { type: String, required: true, unique: true },
  password: { type: String },
  last_update: { type: Date, default: Date.now }
});

// 10. Customer Schema
const CustomerSchema = new mongoose.Schema({
  customer_id: { type: Number, required: true, unique: true },
  store_id: { type: Number, required: true, ref: 'Store' },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String },
  address_id: { type: Number, required: true, ref: 'Address' },
  activebool: { type: Boolean, default: true },
  active: { type: Number, default: 1 },
  create_date: { type: Date, default: Date.now },
  last_update: { type: Date, default: Date.now }
});

// 11. Rental Schema
const RentalSchema = new mongoose.Schema({
  rental_id: { type: Number, required: true, unique: true },
  rental_date: { type: Date, default: Date.now },
  inventory_id: { type: Number, required: true },
  film_id: { type: Number, ref: 'Film' },
  customer_id: { type: Number, required: true, ref: 'Customer' },
  return_date: { type: Date },
  staff_id: { type: Number, required: true, ref: 'Staff' },
  rental_period: { type: String, default: '7 days' },
  last_update: { type: Date, default: Date.now }
});

// 12. Payment Schema
const PaymentSchema = new mongoose.Schema({
  payment_id: { type: Number, required: true, unique: true },
  customer_id: { type: Number, required: true, ref: 'Customer' },
  staff_id: { type: Number, required: true, ref: 'Staff' },
  rental_id: { type: Number, ref: 'Rental' },
  amount: { type: Number, required: true },
  payment_date: { type: Date, default: Date.now }
});

module.exports = {
  Country: mongoose.models.Country || mongoose.model('Country', CountrySchema),
  City: mongoose.models.City || mongoose.model('City', CitySchema),
  Address: mongoose.models.Address || mongoose.model('Address', AddressSchema),
  Category: mongoose.models.Category || mongoose.model('Category', CategorySchema),
  Language: mongoose.models.Language || mongoose.model('Language', LanguageSchema),
  Actor: mongoose.models.Actor || mongoose.model('Actor', ActorSchema),
  Film: mongoose.models.Film || mongoose.model('Film', FilmSchema),
  Store: mongoose.models.Store || mongoose.model('Store', StoreSchema),
  Staff: mongoose.models.Staff || mongoose.model('Staff', StaffSchema),
  Customer: mongoose.models.Customer || mongoose.model('Customer', CustomerSchema),
  Rental: mongoose.models.Rental || mongoose.model('Rental', RentalSchema),
  Payment: mongoose.models.Payment || mongoose.model('Payment', PaymentSchema)
};
