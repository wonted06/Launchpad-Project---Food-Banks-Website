const db = require('../../db');

class Feedback {
  static async create({ rating, service, comment, email }) {
    const result = await db.query(
      `INSERT INTO foodbank.feedback (rating, service, comment, email)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [parseInt(rating), service || null, comment || null, email || null]
    );
    return result.rows[0];
  }

  static async findAll() {
    const result = await db.query(
      'SELECT * FROM foodbank.feedback ORDER BY created_at DESC'
    );
    return result.rows;
  }
}

module.exports = Feedback;