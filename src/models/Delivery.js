const db = require('../../db');

class Delivery {
  static async create({ name, phone, address, postcode, notes, foodBankId, userId }) {
    // Generate sequential reference number: FB-YYYY-NNNN
    const year   = new Date().getFullYear();
    const count  = await db.query('SELECT COUNT(*) FROM foodbank.deliveries');
    const seq    = String(parseInt(count.rows[0].count) + 1).padStart(4, '0');
    const reference = `FB-${year}-${seq}`;

    const result = await db.query(
      `INSERT INTO foodbank.deliveries
         (reference, user_id, food_bank_id, name, phone, address, postcode, notes, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'preparing') RETURNING *`,
      [reference, userId || null, foodBankId || null, name, phone, address, postcode, notes || null]
    );
    return result.rows[0];
  }

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

  static async findByUserId(userId) {
    const result = await db.query(
      'SELECT * FROM foodbank.deliveries WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    return result.rows;
  }
}

module.exports = Delivery;