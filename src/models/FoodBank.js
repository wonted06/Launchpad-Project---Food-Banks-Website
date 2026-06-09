const db = require('../../db');

class FoodBank {
  static async findAll() {
    const result = await db.query(
      'SELECT * FROM foodbank.food_banks ORDER BY name'
    );
    return result.rows;
  }

  static async findById(id) {
    const result = await db.query(
      'SELECT * FROM foodbank.food_banks WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  // Search by name or postcode (case-insensitive partial match)
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
