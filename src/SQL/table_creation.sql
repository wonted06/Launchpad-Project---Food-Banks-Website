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
DROP TABLE IF EXISTS food_banks CASCADE;
DROP TABLE IF EXISTS deliveries CASCADE;
DROP TABLE IF EXISTS contact_submissions CASCADE;
DROP TABLE IF EXISTS feedback CASCADE;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    theme           VARCHAR(10)  NOT NULL DEFAULT 'light',
    text_size       SMALLINT     NOT NULL DEFAULT 15,
    colour_blind    BOOLEAN      NOT NULL DEFAULT FALSE,
    text_to_speech  BOOLEAN      NOT NULL DEFAULT FALSE,
    language VARCHAR(20) NOT NULL DEFAULT 'en',
    diet            TEXT,
    allergies       TEXT,
    mobility        TEXT
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

-- Food Banks table
CREATE TABLE IF NOT EXISTS food_banks (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(150) NOT NULL,
  address     TEXT NOT NULL,
  postcode    VARCHAR(10)  NOT NULL,
  phone       VARCHAR(20),
  email       VARCHAR(150),
  lat         DECIMAL(9,6) NOT NULL,
  lng         DECIMAL(9,6) NOT NULL,
  hours       TEXT,
  description TEXT,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- Deliveries table
CREATE TABLE IF NOT EXISTS deliveries (
  id           SERIAL       PRIMARY KEY,
  reference    VARCHAR(20)  UNIQUE NOT NULL,
  user_id      INTEGER      REFERENCES users(id),
  food_bank_id INTEGER      REFERENCES food_banks(id),
  name         VARCHAR(100) NOT NULL,
  phone        VARCHAR(20)  NOT NULL,
  address      TEXT         NOT NULL,
  postcode     VARCHAR(10)  NOT NULL,
  notes        TEXT,
  status       VARCHAR(20)  DEFAULT 'preparing',
  created_at   TIMESTAMP    DEFAULT NOW()
);

-- Contact Submission table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(150) NOT NULL,
  subject    VARCHAR(50)  NOT NULL DEFAULT 'General Enquiry',
  message    TEXT         NOT NULL,
  created_at TIMESTAMP    DEFAULT NOW()
);

-- Feedback table
CREATE TABLE IF NOT EXISTS feedback (
  id         SERIAL PRIMARY KEY,
  rating     SMALLINT     NOT NULL CHECK (rating BETWEEN 1 AND 5),
  service    VARCHAR(50),
  comment    TEXT,
  email      VARCHAR(150),
  created_at TIMESTAMP    DEFAULT NOW()
);