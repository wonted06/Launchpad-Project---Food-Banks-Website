const db = require('../../db');

// Schema (PostgreSQL):
// CREATE TABLE food_banks (
//   id         SERIAL PRIMARY KEY,
//   name       VARCHAR(150) NOT NULL,
//   address    TEXT NOT NULL,
//   postcode   VARCHAR(10) NOT NULL,
//   phone      VARCHAR(20),
//   email      VARCHAR(150),
//   lat        DECIMAL(9,6),
//   lng        DECIMAL(9,6),
//   hours      JSONB,   -- { mon: '10-16', tue: '10-16', ... }
//   created_at TIMESTAMP DEFAULT NOW()
// );

class FoodBank {
  static async findAll() {
    // const result = await db.query('SELECT * FROM food_banks ORDER BY name');
    // return result.rows;
  }

  static async findById(id) {
    // const result = await db.query('SELECT * FROM food_banks WHERE id = $1', [id]);
    // return result.rows[0] || null;
  }

  static async findNearPostcode(postcode) {
    // Use PostGIS or a geocoding API to find nearby banks
    // const coords = await geocode(postcode);
    // const result = await db.query('SELECT *, ST_Distance(...) AS distance FROM food_banks ORDER BY distance LIMIT 10');
    // return result.rows;
  }
}

module.exports = FoodBank;
