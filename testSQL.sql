-- This creates every table our app needs from scratch, with all 
-- relationships, constraints, and indexes.
-- 
-- Running it again will drop and recreate everything 
-- (useful but it will delete all existing data)
-- --------------------------------------------------------------------

-- Ensure schema exists and is selected
CREATE SCHEMA IF NOT EXISTS foodbank;
SET search_path TO foodbank;

-- This ensures that this script can be run multiple times without errors
DROP TABLE IF EXISTS users CASCADE;

-- Users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- View users
-- SELECT id, username, email, created_at
-- FROM users;

