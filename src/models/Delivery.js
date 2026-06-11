const db = require('../../db');

// Model for the foodbank.deliveries table.
class Delivery {
  // Creates a new delivery record and generates a unique reference number (e.g. FB-2026-0001).
  // The sequence number is based on total row count + 1, zero-padded to 4 digits.
  static async create({ name, phone, address, postcode, notes, foodBankId, userId }) {
    // Generate sequential reference number: FB-YYYY-NNNN
    const year   = new Date().getFullYear();
    const count  = await db.query('SELECT COUNT(*) FROM foodbank.deliveries');
    const seq    = String(parseInt(count.rows[0].count) + 1).padStart(4, '0');
    const reference = `FB-${year}-${seq}`;

    // Status defaults to 'preparing' — updated manually via pgAdmin
    const result = await db.query(
      `INSERT INTO foodbank.deliveries
         (reference, user_id, food_bank_id, name, phone, address, postcode, notes, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'preparing') RETURNING *`,
      [reference, userId || null, foodBankId || null, name, phone, address, postcode, notes || null]
    );
    return result.rows[0];
  }

  // Looks up a delivery by reference number, joining food bank details
  // so the tracking page can display the food bank name and draw a route map.
  static async findByReference(ref) {
    const result = await db.query(
      `SELECT d.*,
              fb.name    AS food_bank_name,
              fb.address AS food_bank_address,
              fb.lat     AS food_bank_lat,
              fb.lng     AS food_bank_lng
       FROM foodbank.deliveries d
       LEFT JOIN foodbank.food_banks fb ON fb.id = d.food_bank_id
       WHERE d.reference = $1`,
      [ref]
    );
    return result.rows[0] || null;
  }

  // Returns all deliveries for a logged-in user, newest first
  static async findByUserId(userId) {
    const result = await db.query(
      'SELECT * FROM foodbank.deliveries WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    return result.rows;
  }
}

module.exports = Delivery;