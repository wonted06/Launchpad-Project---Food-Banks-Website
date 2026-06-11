const db = require('../../db');

// Model for the foodbank.food_banks table.
// Stores name, address, postcode, lat/lng coordinates, hours, and contact details.
class FoodBank {
  // Returns all food banks sorted alphabetically — used for the locations map and delivery search
  static async findAll() {
    const result = await db.query(
      'SELECT * FROM foodbank.food_banks ORDER BY name'
    );
    return result.rows;
  }

  // Returns a single food bank by its primary key — used for the detail page
  static async findById(id) {
    const result = await db.query(
      'SELECT * FROM foodbank.food_banks WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  // Case-insensitive partial match on name or postcode — used for server-side search fallback
  static async search(query) {
    const q = `%${query}%`;
    const result = await db.query(
      `SELECT * FROM foodbank.food_banks
       WHERE name ILIKE $1 OR postcode ILIKE $1
       ORDER BY name`,
      [q]
    );
    return result.rows;
  }
}

module.exports = FoodBank;
