const db = require('../../db');
const bcrypt = require('bcrypt');

// PostgreSQL schema (foodbank.users):
// CREATE TABLE users (
//   id            SERIAL PRIMARY KEY,
//   username      VARCHAR(50)  UNIQUE NOT NULL,
//   email         VARCHAR(255) UNIQUE NOT NULL,
//   password_hash TEXT         NOT NULL,
//   created_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
// );

class User {
  /**
   * Find a user by their email address.
   * @param {string} email
   * @returns {object|null} user row or null
   */
  static async findByEmail(email) {
    const result = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0] || null;
  }

  /**
   * Find a user by their ID.
   * @param {number} id
   * @returns {object|null} user row or null
   */
  static async findById(id) {
    const result = await db.query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  /**
   * Create a new user with a bcrypt-hashed password.
   * @param {object} params - { username, email, password }
   * @returns {object} the newly created user row
   */
  static async create({ username, email, password }) {
    const hash = await bcrypt.hash(password, 10);
    const result = await db.query(
      `INSERT INTO users (username, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [username, email, hash]
    );
    return result.rows[0];
  }

  /**
   * Check if a username already exists.
   * @param {string} username
   * @returns {boolean}
   */
  static async usernameExists(username) {
    const result = await db.query(
      'SELECT id FROM users WHERE username = $1',
      [username]
    );
    return result.rows.length > 0;
  }

  /**
   * Check if an email already exists.
   * @param {string} email
   * @returns {boolean}
   */
  static async emailExists(email) {
    const result = await db.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );
    return result.rows.length > 0;
  }
}

module.exports = User;
