require('dotenv').config();
const env = process.env.NODE_ENV || "development";
const config = require("./config")[env];
const { Pool } = require("pg");

// Create a PostgreSQL connection pool using the config for the current environment.
// A pool reuses connections rather than opening a new one for every query.
const pool = new Pool({
	...config,
});

// Set the default schema to 'foodbank' for every new client in the pool.
// This means queries can use table names directly (e.g. 'users') without
// having to prefix them with 'foodbank.' every time.
pool.on('connect', (client) => {
  client.query('SET search_path TO foodbank');
});

// Test the connection on startup and log the result.
pool.connect((err) => {
	if (err) {
		console.error("Database connection failed:", err);
	} else {
		console.log("Connected Successfully!");
	}
});

module.exports = pool;
