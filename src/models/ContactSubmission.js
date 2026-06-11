const db = require('../../db');

// Model for the foodbank.contact_submissions table.
// Submissions are viewable in pgAdmin — there is no admin UI on the site.
class ContactSubmission {
  // Inserts a new contact message; defaults subject to 'General Enquiry' if not supplied
  static async create({ name, email, subject, message }) {
    const result = await db.query(
      `INSERT INTO foodbank.contact_submissions (name, email, subject, message)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, email, subject || 'General Enquiry', message]
    );
    return result.rows[0];
  }

  // Returns all submissions newest-first — used for admin review in pgAdmin
  static async findAll() {
    const result = await db.query(
      'SELECT * FROM foodbank.contact_submissions ORDER BY created_at DESC'
    );
    return result.rows;
  }
}

module.exports = ContactSubmission;