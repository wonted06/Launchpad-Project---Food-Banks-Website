const db = require('../../db');

// Model for the hot_meals table.
// The hot meal schedule on the page is currently static HTML — this model
// is a stub for a future dynamic implementation.
//
// Schema (PostgreSQL):
// CREATE TABLE hot_meals (
//   id            SERIAL PRIMARY KEY,
//   food_bank_id  INTEGER REFERENCES food_banks(id),
//   day_of_week   VARCHAR(10) NOT NULL,  -- monday | tuesday | ...
//   start_time    TIME NOT NULL,
//   end_time      TIME NOT NULL,
//   menu          TEXT,
//   max_spaces    INTEGER DEFAULT 30,
//   booked_spaces INTEGER DEFAULT 0,
//   active        BOOLEAN DEFAULT TRUE
// );

class HotMeal {
  // TODO: Implement to fetch this week's active schedule, ordered by day.
  // Would join hot_meals → food_banks to get name and address for each slot.
  static async getWeeklySchedule() {
    // const result = await db.query(
    //   'SELECT hm.*, f.name AS bank_name, f.address FROM hot_meals hm JOIN food_banks f ON hm.food_bank_id = f.id WHERE hm.active = TRUE ORDER BY CASE day_of_week WHEN \'monday\' THEN 1 WHEN \'tuesday\' THEN 2 ...'
    // );
    // return result.rows;
    return []; // stub — schedule is currently static HTML in hot-meals.pug
  }
}

module.exports = HotMeal;
