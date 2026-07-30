====================================================================
           PAGILA BACKEND REST API - POSTMAN USER GUIDE
====================================================================

STEP 1: START THE SERVER
--------------------------------------------------------------------
Run the following command in your terminal/command prompt:

   node server.js

Base API URL: http://localhost:3000/api/v1


STEP 2: IMPORT PRE-BUILT POSTMAN COLLECTION (ONE-CLICK SETUP)
--------------------------------------------------------------------
1. Open Postman app.
2. Click the "Import" button (top left).
3. Select the file "pagila-api.postman_collection.json" from this project folder.
4. All APIs with ready-made requests will appear in your Postman sidebar!


====================================================================
STEP 3: HOW TO SEND POST REQUESTS IN POSTMAN (EXAMPLES)
====================================================================

In Postman:
  - Set HTTP Method to "POST"
  - Enter Request URL (e.g., http://localhost:3000/api/v1/films)
  - Go to "Headers" tab -> Add: Content-Type = application/json
  - Go to "Body" tab -> Select "raw" -> Choose "JSON"
  - Paste the sample JSON payload below and click "Send".


--------------------------------------------------------------------
1. ADD A NEW FILM (POST /api/v1/films)
--------------------------------------------------------------------
URL: http://localhost:3000/api/v1/films
Method: POST
Headers: Content-Type: application/json

Example Request Body (JSON):
{
  "title": "AVATAR THE WAY OF WATER",
  "description": "A epic sci-fi adventure set on the moon Pandora",
  "release_year": 2022,
  "language_id": 1,
  "rental_duration": 5,
  "rental_rate": 4.99,
  "length": 192,
  "replacement_cost": 29.99,
  "rating": "PG-13",
  "special_features": "Deleted Scenes,Behind the Scenes"
}


--------------------------------------------------------------------
2. ADD A NEW ACTOR (POST /api/v1/actors)
--------------------------------------------------------------------
URL: http://localhost:3000/api/v1/actors
Method: POST
Headers: Content-Type: application/json

Example Request Body (JSON):
{
  "first_name": "ROBERT",
  "last_name": "DOWNEY"
}


--------------------------------------------------------------------
3. ADD A NEW CUSTOMER (POST /api/v1/customers)
--------------------------------------------------------------------
URL: http://localhost:3000/api/v1/customers
Method: POST
Headers: Content-Type: application/json

Example Request Body (JSON):
{
  "first_name": "JOHN",
  "last_name": "DOE",
  "email": "john.doe@example.com",
  "store_id": 1,
  "address_id": 1
}


--------------------------------------------------------------------
4. CREATE A NEW RENTAL CHECKOUT (POST /api/v1/rentals)
--------------------------------------------------------------------
URL: http://localhost:3000/api/v1/rentals
Method: POST
Headers: Content-Type: application/json

Example Request Body (JSON):
{
  "inventory_id": 1,
  "customer_id": 1,
  "staff_id": 1,
  "rental_period": "7 days"
}


--------------------------------------------------------------------
5. ADD A NEW PAYMENT TRANSACTION (POST /api/v1/payments)
--------------------------------------------------------------------
URL: http://localhost:3000/api/v1/payments
Method: POST
Headers: Content-Type: application/json

Example Request Body (JSON):
{
  "customer_id": 1,
  "staff_id": 1,
  "rental_id": 1,
  "amount": 4.99
}


--------------------------------------------------------------------
6. ADD A NEW ADDRESS (POST /api/v1/addresses)
--------------------------------------------------------------------
URL: http://localhost:3000/api/v1/addresses
Method: POST
Headers: Content-Type: application/json

Example Request Body (JSON):
{
  "address": "100 Innovation Way",
  "address2": "Suite 500",
  "district": "California",
  "city_id": 1,
  "postal_code": "90210",
  "phone": "5551234567"
}


====================================================================
STEP 4: COMPLETE LIST OF ALL GET / PUT / DELETE ENDPOINTS
====================================================================

[FILMS]
- GET    http://localhost:3000/api/v1/films              (List all films with search & pagination)
- GET    http://localhost:3000/api/v1/films/1            (Get film details by ID)
- PUT    http://localhost:3000/api/v1/films/1            (Update film details)
- DELETE http://localhost:3000/api/v1/films/1            (Delete film by ID)

[ACTORS]
- GET    http://localhost:3000/api/v1/actors             (List all actors)
- GET    http://localhost:3000/api/v1/actors/1           (Get actor details & filmography)
- PUT    http://localhost:3000/api/v1/actors/1           (Update actor name)
- DELETE http://localhost:3000/api/v1/actors/1           (Delete actor)

[CUSTOMERS]
- GET    http://localhost:3000/api/v1/customers          (List all customers)
- GET    http://localhost:3000/api/v1/customers/1        (Get customer details & rentals)
- PUT    http://localhost:3000/api/v1/customers/1        (Update customer info)
- DELETE http://localhost:3000/api/v1/customers/1        (Delete customer)

[RENTALS & PAYMENTS]
- GET    http://localhost:3000/api/v1/rentals            (List all rentals)
- GET    http://localhost:3000/api/v1/rentals/1          (Get rental details)
- PATCH  http://localhost:3000/api/v1/rentals/1/return   (Return a rented film)
- GET    http://localhost:3000/api/v1/payments           (List payment transactions)

[METADATA & LOCATIONS]
- GET    http://localhost:3000/api/v1/stores             (List store locations)
- GET    http://localhost:3000/api/v1/staff              (List staff members)
- GET    http://localhost:3000/api/v1/addresses          (List address records)
- GET    http://localhost:3000/api/v1/locations/cities  (List cities)
- GET    http://localhost:3000/api/v1/locations/countries (List countries)
- GET    http://localhost:3000/api/v1/languages          (List supported languages)

====================================================================
