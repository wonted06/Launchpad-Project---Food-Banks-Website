require('dotenv').config();
const env = process.env.NODE_ENV || "development";
const config = require("./config")[env];
const { Pool } = require("pg");

// Use the foodbank schema as the default search path so all unqualified
// table references resolve to the correct schema.
const pool = new Pool({
	...config,
});

pool.on('connect', (client) => {
  client.query('SET search_path TO foodbank');
});

pool.connect((err) => {
	if (err) {
		console.error("Database connection failed:", err);
	} else {
		console.log("Connected Successfully!");
	}
});

module.exports = pool;
