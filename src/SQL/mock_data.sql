
INSERT INTO categories (category_name)
VALUES
  ('Canned'),
  ('Dry'),
  ('Fresh'),
  ('Frozen')
ON CONFLICT DO NOTHING;

INSERT INTO locations (location_name, location_type)
VALUES
  ('Main Warehouse', 'Warehouse'),
  ('Walk-in Fridge', 'Fridge'),
  ('Freezer A', 'Freezer')
ON CONFLICT DO NOTHING;

INSERT INTO products (
  product_name, product_brand, category_id,
  calories_per_100g, weight_grams, unit_type,
  is_halal, is_vegetarian, is_vegan
)
VALUES
  ('Baked Beans',      'Heinz',           (SELECT category_id FROM categories WHERE category_name = 'Canned'),  78,  415,  'Tin',  TRUE,  TRUE,  TRUE),
  ('Chopped Tomatoes', 'Napolina',        (SELECT category_id FROM categories WHERE category_name = 'Canned'),  32,  400,  'Tin',  TRUE,  TRUE,  TRUE),
  ('Brown Rice',       'Tilda',           (SELECT category_id FROM categories WHERE category_name = 'Dry'),    362, 1000,  'Bag',  TRUE,  TRUE,  TRUE),
  ('Chicken Soup',     'Heinz',           (SELECT category_id FROM categories WHERE category_name = 'Canned'),  42,  400,  'Tin',  FALSE, FALSE, FALSE),
  ('Frozen Peas',      'Birds Eye',       (SELECT category_id FROM categories WHERE category_name = 'Frozen'),  81,  900,  'Bag',  TRUE,  TRUE,  TRUE),
  ('Cheddar Cheese',   'Cathedral City',  (SELECT category_id FROM categories WHERE category_name = 'Fresh'),  416,  400,  'Pack', FALSE, TRUE,  FALSE)
ON CONFLICT DO NOTHING;

INSERT INTO inventory (product_id, location_id, quantity, received_date, expiry_date, batch_number)
VALUES
  (
    (SELECT product_id FROM products WHERE product_name = 'Baked Beans'      AND product_brand = 'Heinz'),
    (SELECT location_id FROM locations WHERE location_name = 'Main Warehouse'),
    85, '2025-05-01', '2026-06-01', 'BB001'
  ),
  (
    (SELECT product_id FROM products WHERE product_name = 'Baked Beans'      AND product_brand = 'Heinz'),
    (SELECT location_id FROM locations WHERE location_name = 'Main Warehouse'),
    40, '2025-06-01', '2026-08-01', 'BB002'
  ),
  (
    (SELECT product_id FROM products WHERE product_name = 'Chopped Tomatoes' AND product_brand = 'Napolina'),
    (SELECT location_id FROM locations WHERE location_name = 'Main Warehouse'),
    120, '2025-04-10', '2026-10-01', 'CT001'
  ),
  (
    (SELECT product_id FROM products WHERE product_name = 'Brown Rice'       AND product_brand = 'Tilda'),
    (SELECT location_id FROM locations WHERE location_name = 'Main Warehouse'),
    45, '2025-05-20', '2027-01-01', 'BR001'
  ),
  (
    (SELECT product_id FROM products WHERE product_name = 'Brown Rice'       AND product_brand = 'Tilda'),
    (SELECT location_id FROM locations WHERE location_name = 'Main Warehouse'),
    18, '2025-06-01', '2027-03-01', 'BR002'
  ),
  (
    (SELECT product_id FROM products WHERE product_name = 'Chicken Soup'     AND product_brand = 'Heinz'),
    (SELECT location_id FROM locations WHERE location_name = 'Main Warehouse'),
    12, '2025-06-01', '2026-03-01', 'CS001'
  ),
  (
    (SELECT product_id FROM products WHERE product_name = 'Frozen Peas'      AND product_brand = 'Birds Eye'),
    (SELECT location_id FROM locations WHERE location_name = 'Freezer A'),
    30, '2025-05-15', '2026-05-15', 'FP001'
  ),
  (
    (SELECT product_id FROM products WHERE product_name = 'Cheddar Cheese'   AND product_brand = 'Cathedral City'),
    (SELECT location_id FROM locations WHERE location_name = 'Walk-in Fridge'),
    6, '2025-06-04', '2025-07-04', 'CC001'
  )
ON CONFLICT (product_id, location_id, batch_number) DO NOTHING;


-- PostgreSQL SERIAL columns use sequence generators.
-- Sequence values are consumed when requested and are not reused if a transaction fails or rows are deleted. Therefore gaps in identifier values are expected behaviour and do not indicate missing data.
INSERT INTO inventory (
    product_id,
	location_id,
    quantity,
    received_date,
    expiry_date,
    batch_number
)
VALUES (
    -- 'SELECT' statements below makes it easier to select which 
    -- product and location without having to look for their respective IDs.
    (SELECT product_id
     FROM products
     WHERE product_name = 'Baked Beans'),

    (SELECT location_id
     FROM locations
     WHERE location_name = 'Main Warehouse'),
    50,
    '2025-05-01',
    '2026-01-01',
    'BB001'
);


-- PostgreSQL SERIAL columns use sequence generators.

-- Sequence values are consumed when requested and are not reused if a transaction 
-- fails or rows are deleted. Therefore gaps in identifier values are expected 
-- behaviour and do not indicate missing data.
