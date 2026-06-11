const db = require('../../db');

// Model for the inventory table, which links products to food banks with quantity and expiry data.
class Inventory {
  // Returns inventory items with optional category and name filters.
  // Joins across inventory → products → categories → food_banks to build the full display row.
  // Passing null for a filter param disables that filter (handled by the $1::text IS NULL check).
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
        fb.name AS location_name,
        i.quantity,
        i.expiry_date
      FROM inventory i
      JOIN products p ON i.product_id = p.product_id
      JOIN categories c ON p.category_id = c.category_id
      JOIN food_banks fb ON i.food_bank_id = fb.id
      WHERE ($1::text IS NULL OR LOWER(c.category_name) = LOWER($1))
        AND ($2::text IS NULL OR p.product_name ILIKE $2)
      ORDER BY p.product_name
    `;

    const result = await db.query(sql, params);
    return result.rows;
  }

  // Returns all category names — used to populate the category filter dropdown
  static async getCategories() {
    const result = await db.query(
      'SELECT category_id, category_name FROM categories ORDER BY category_name'
    );
    return result.rows;
  }
}

module.exports = Inventory;
