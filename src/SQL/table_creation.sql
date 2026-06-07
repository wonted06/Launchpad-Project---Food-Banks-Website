-- schema launchpad


-- Ensure schema exists and is selected
-- Prevents other schemas on the system from being 
CREATE SCHEMA IF NOT EXISTS foodbank;
SET search_path TO foodbank;

-- Recreates tables to be empty everytime when running these DROP TABLE queries,
-- but ensures that this entire script can be run multiple times without errors
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS locations CASCADE;
DROP TABLE IF EXISTS inventory CASCADE;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
	category_id SERIAL PRIMARY KEY,
	category_name VARCHAR(50) NOT NULL UNIQUE
);

-- Products table
CREATE TABLE IF NOT EXISTS  products (
    product_id SERIAL PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    product_brand VARCHAR(100),
    category_id INT REFERENCES categories(category_id),
    calories_per_100g INT CHECK (calories_per_100g >= 0),
    weight_grams INT CHECK (weight_grams > 0),
    description TEXT,
    unit_type VARCHAR(20),
    is_halal BOOLEAN DEFAULT FALSE,
    is_vegetarian BOOLEAN DEFAULT FALSE,
    is_vegan BOOLEAN DEFAULT FALSE
);

-- Locations table
CREATE TABLE IF NOT EXISTS  locations (
    location_id SERIAL PRIMARY KEY,
    location_name VARCHAR(100) NOT NULL UNIQUE,
    location_type VARCHAR(50) NOT NULL
);

-- Inventory table
CREATE TABLE IF NOT EXISTS  inventory (
    inventory_id SERIAL PRIMARY KEY,
    product_id INT NOT NULL REFERENCES products(product_id),
    location_id INT NOT NULL REFERENCES locations(location_id),
    quantity INT  NOT NULL CHECK (quantity >= 0),
    received_date DATE,
    expiry_date DATE NOT NULL,
    batch_number VARCHAR(50) NOT NULL

    --check if expired
    CHECK (
    expiry_date IS NULL OR
    received_date IS NULL OR
    expiry_date >= received_date),

    UNIQUE (product_id, location_id, batch_number)
);



