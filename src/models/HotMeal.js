const db = require('../../db');

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
  static async getWeeklySchedule() {
    // const result = await db.query(
    //   'SELECT hm.*, f.name AS bank_name, f.address FROM hot_meals hm JOIN food_banks f ON hm.food_bank_id = f.id WHERE hm.active = TRUE ORDER BY CASE day_of_week WHEN \'monday\' THEN 1 WHEN \'tuesday\' THEN 2 ...'
    // );
    // return result.rows;
  }
}

module.exports = HotMeal;
