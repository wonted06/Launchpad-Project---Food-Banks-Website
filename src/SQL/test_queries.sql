-- Show saved users' login details,
-- hashed password and account creation date
-- SELECT * FROM users;


-- Show inventory with product names

SELECT
    p.product_name,
    i.quantity,
    fb.name AS location_name
FROM inventory i
JOIN products p
ON p.product_id = i.product_id
JOIN food_banks fb
ON fb.id = i.food_bank_id;

SELECT
    p.product_name,
    p.product_brand,
    c.category_name,
    i.quantity,
    fb.name AS location_name,
    i.expiry_date
FROM inventory i
JOIN products p
    ON i.product_id = p.product_id
JOIN categories c
    ON p.category_id = c.category_id
JOIN food_banks fb
    ON i.food_bank_id = fb.id;
