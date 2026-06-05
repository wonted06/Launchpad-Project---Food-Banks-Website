-- schema launchpad

CREATE TABLE categories (
	category_id SERIAL PRIMARY KEY,
	category_name VARCHAR(50) NOT NULL UNIQUE
	
);

CREATE TABLE products (
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
    is_vegan BOOLEAN DEFAULT FALSE, 

    
);

CREATE TABLE locations (
    location_id SERIAL PRIMARY KEY,
    location_name VARCHAR(100) NOT NULL UNIQUE,
    location_type VARCHAR(50) NOT NULL
);

CREATE TABLE inventory (
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



