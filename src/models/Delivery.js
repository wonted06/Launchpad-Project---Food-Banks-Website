const db = require('../../db');

// Schema (PostgreSQL):
// CREATE TABLE deliveries (
//   id           SERIAL PRIMARY KEY,
//   reference    VARCHAR(20) UNIQUE NOT NULL,  -- e.g. FB-2025-0001
//   user_id      INTEGER REFERENCES users(id),
//   name         VARCHAR(100) NOT NULL,
//   phone        VARCHAR(20) NOT NULL,
//   address      TEXT NOT NULL,
//   postcode     VARCHAR(10) NOT NULL,
//   notes        TEXT,
//   status       VARCHAR(20) DEFAULT 'pending',  -- pending | preparing | out_for_delivery | delivered
//   created_at   TIMESTAMP DEFAULT NOW(),
//   delivered_at TIMESTAMP
// );

class Delivery {
  static async findByReference(ref) {
    // const result = await db.query('SELECT * FROM deliveries WHERE reference = $1', [ref]);
    // return result.rows[0] || null;
  }

  static async findByUserId(userId) {
    // const result = await db.query('SELECT * FROM deliveries WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    // return result.rows;
  }

  static async create({ name, phone, address, postcode, notes, userId }) {
    // Generate reference number, insert, return
  }
}

module.exports = Delivery;
