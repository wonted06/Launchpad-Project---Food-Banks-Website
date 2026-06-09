const db = require('../../db');

class Inventory {
  static async getAll({ category, query } = {}) {
    const params = [
      category || null,
      query ? `%${query}%` : null
    ];

    const sql = `
      SELECT
        p.product_name,
        p.weight_grams,
        c.category_name,
        l.location_name,
        i.quantity,
        i.expiry_date
      FROM inventory i
      JOIN products p ON i.product_id = p.product_id
      JOIN categories c ON p.category_id = c.category_id
      JOIN locations l ON i.location_id = l.location_id
      WHERE ($1::text IS NULL OR LOWER(c.category_name) = LOWER($1))
        AND ($2::text IS NULL OR p.product_name ILIKE $2)
      ORDER BY p.product_name
    `;

    const result = await db.query(sql, params);
    return result.rows;
  }

  static async getCategories() {
    const result = await db.query(
      'SELECT category_id, category_name FROM categories ORDER BY category_name'
    );
    return result.rows;
  }
}

module.exports = Inventory;
