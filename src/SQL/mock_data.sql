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


INSERT INTO food_banks (name, address, postcode, phone, email, lat, lng, hours, description) VALUES
('Birmingham Central Food Bank',   '123 Broad Street, Birmingham',             'B1 2AA',  '0121 000 1001', 'central@feedbirmingham.org',      52.481400, -1.900000, 'Mon–Fri: 10:00–16:00',                  'Centrally located food bank serving the city centre area.'),
('Sparkhill Food Bank',            '78 Sparkhill Road, Birmingham',            'B11 4EJ', '0121 000 1002', 'sparkhill@feedbirmingham.org',    52.455500, -1.862000, 'Mon, Wed, Fri: 11:00–14:00',            'Community food bank serving the Sparkhill and Sparkbrook areas.'),
('Narthex Sparkhill',              '40 Stratford Road, Sparkhill, Birmingham', 'B11 1JB', '0121 000 1003', 'narthex@feedbirmingham.org',      52.457500, -1.865000, 'Tue, Thu: 10:00–13:00',                 'Community hub providing hot meals and food parcels.'),
('Kings Heath Food Bank',          '18 Institute Road, Kings Heath',           'B14 7EG', '0121 000 1004', 'kingsheath@feedbirmingham.org',   52.428000, -1.887000, 'Mon–Thu: 09:30–15:30, Fri: 09:30–13:00','Serving the Kings Heath, Moseley and Stirchley communities.'),
('B30 Foodbank Centre',            '23a Watford Road, Bournville',             'B30 2JG', '07582 143972',  'b30@feedbirmingham.org',          52.428500, -1.925000, 'Tue: 13:30–15:30, Fri: 10:00–12:00',   'Friendly volunteers and excellent food provision for south Birmingham.'),
('Great Barr Food Bank',           'Broome Avenue, Great Barr',                'B44 8NL', '0121 357 5399', 'greatbarr@feedbirmingham.org',    52.552000, -1.905000, 'Wed: 10:00–12:00, Fri: 12:00–14:00',   'Well-organised food bank serving the Great Barr and Pheasey areas.'),
('Bethany Foodbank',               'Church Road, Erdington, Birmingham',       'B23 7AB', '0121 000 1007', 'bethany@feedbirmingham.org',      52.503000, -1.874000, 'Mon, Wed, Fri: 10:00–13:00',            'Faith-based food bank open to all Birmingham residents.'),
('Green Lane Food Bank',           '45 Green Lane, Small Heath',               'B9 5DE',  '0121 000 1008', 'greenlane@feedbirmingham.org',    52.466000, -1.853000, 'Tue, Thu, Sat: 10:00–14:00',            'Serving the Small Heath and Bordesley Green communities.'),
('Noor E Huda Masjid Food Bank',   '120 Highfield Road, Hall Green',           'B28 0EL', '0121 000 1009', 'noorelhuda@feedbirmingham.org',   52.452000, -1.838000, 'Daily: 08:00–22:00',                    '24-hour food bank providing support at any time of day.'),
('Feeding Hands Digbeth',          '24-28 Smithfield House, Digbeth',          'B5 6BS',  '0300 000 0300', 'digbeth@feedbirmingham.org',      52.472000, -1.886000, 'Mon–Sat: 09:00–17:00',                  'Open to all — no referral needed. Serves the Digbeth and Highgate areas.');


-- PostgreSQL SERIAL columns use sequence generators.
-- Sequence values are consumed when requested and are not reused if a transaction fails or rows are deleted. Therefore gaps in identifier values are expected behaviour and do not indicate missing data.