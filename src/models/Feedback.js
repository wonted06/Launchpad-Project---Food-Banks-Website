const db = require('../../db');

// Model for the foodbank.feedback table.
// Feedback is viewable in pgAdmin — there is no admin UI on the site.
class Feedback {
  // Inserts a feedback row; rating is cast to int to satisfy the DB CHECK constraint (1–5).
  // service, comment, and email are all optional and stored as NULL if not provided.
  static async create({ rating, service, comment, email }) {
    const result = await db.query(
      `INSERT INTO foodbank.feedback (rating, service, comment, email)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [parseInt(rating), service || null, comment || null, email || null]
    );
    return result.rows[0];
  }

  // Returns all feedback newest-first — used for admin review in pgAdmin
  static async findAll() {
    const result = await db.query(
      'SELECT * FROM foodbank.feedback ORDER BY created_at DESC'
    );
    return result.rows;
  }
}

module.exports = Feedback;