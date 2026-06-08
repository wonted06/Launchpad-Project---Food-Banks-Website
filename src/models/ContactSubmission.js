const db = require('../../db');

class ContactSubmission {
  static async create({ name, email, subject, message }) {
    const result = await db.query(
      `INSERT INTO foodbank.contact_submissions (name, email, subject, message)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, email, subject || 'General Enquiry', message]
    );
    return result.rows[0];
  }

  static async findAll() {
    const result = await db.query(
      'SELECT * FROM foodbank.contact_submissions ORDER BY created_at DESC'
    );
    return result.rows;
  }
}

module.exports = ContactSubmission;