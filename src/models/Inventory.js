const db = require('../../db');

// Schema (PostgreSQL):
// CREATE TABLE inventory (
//   id            SERIAL PRIMARY KEY,
//   food_bank_id  INTEGER REFERENCES food_banks(id),
//   item_name     VARCHAR(150) NOT NULL,
//   category      VARCHAR(50),      -- tinned | dried | fresh | dairy | bakery | hygiene
//   quantity      INTEGER DEFAULT 0,
//   max_quantity  INTEGER DEFAULT 100,
//   unit          VARCHAR(20),      -- cans | kg | loaves | bars etc.
//   updated_at    TIMESTAMP DEFAULT NOW()
// );

class Inventory {
  static async findAll({ category, query } = {}) {
    // const result = await db.query('SELECT i.*, f.name AS bank_name FROM inventory i JOIN food_banks f ON i.food_bank_id = f.id ...');
    // return result.rows;
  }

  static async findByFoodBank(foodBankId) {
    // const result = await db.query('SELECT * FROM inventory WHERE food_bank_id = $1', [foodBankId]);
    // return result.rows;
  }

  static async updateQuantity(id, quantity) {
    // const result = await db.query('UPDATE inventory SET quantity = $1, updated_at = NOW() WHERE id = $2 RETURNING *', [quantity, id]);
    // return result.rows[0];
  }
}

module.exports = Inventory;
