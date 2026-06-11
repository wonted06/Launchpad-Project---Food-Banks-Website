const db = require('../../db');
const bcrypt = require('bcrypt');

// PostgreSQL schema (foodbank.users):
// CREATE TABLE users (
//   id            SERIAL PRIMARY KEY,
//   username      VARCHAR(50)   UNIQUE NOT NULL,
//   email         VARCHAR(255)  UNIQUE NOT NULL,
//   password_hash TEXT          NOT NULL,
//   created_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
//   theme         VARCHAR(10)   DEFAULT 'light',
//   text_size     INTEGER       DEFAULT 15,
//   colour_blind  BOOLEAN       DEFAULT FALSE,
//   text_to_speech BOOLEAN      DEFAULT FALSE,
//   language      VARCHAR(20)   DEFAULT 'en',
//   diet          TEXT,
//   allergies     TEXT,
//   mobility      TEXT
// );

class User {
  /**
   * Find a user by their email address.
   * @param {string} email
   * @returns {object|null} user row or null
   */
  static async findByEmail(email) {
    const result = await db.query(
      'SELECT * FROM foodbank.users WHERE email = $1',
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
      'SELECT * FROM foodbank.users WHERE id = $1',
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
      `INSERT INTO foodbank.users (username, email, password_hash)
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
      'SELECT id FROM foodbank.users WHERE username = $1',
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
      'SELECT id FROM foodbank.users WHERE email = $1',
      [email]
    );
    return result.rows.length > 0;
  }

  // Updates username and email for the given user
  static async updateAccount(userId, username, email) {
    const query =
        `UPDATE foodbank.users
          SET username = $1, email = $2 WHERE id = $3`;

    await db.query(query, [
        username,
        email,
        userId
    ]);
  }

  // Updates dietary requirements, allergies, and mobility notes
  static async updateHealth(userId, diet, allergies, mobility) {
    await db.query(
      `UPDATE foodbank.users
       SET diet = $1, allergies = $2, mobility = $3
       WHERE id = $4`,
      [diet, allergies, mobility, userId]
    );
  }

  // Stores a pre-hashed password — hashing is done in the controller before calling this
  static async updatePassword(userId, hashedPassword) {
    await db.query(
      `UPDATE foodbank.users
       SET password_hash = $1
       WHERE id = $2`,
      [hashedPassword, userId]
    );
  }
}

module.exports = User;
