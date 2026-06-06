
INSERT INTO categories (category_name)
VALUES
('Canned'),
('Dry'),
('Fresh'),
('Frozen');

INSERT INTO locations (location_name, location_type)
VALUES
('Main Warehouse', 'Warehouse'),
('Walk-in Fridge', 'Fridge'),
('Freezer A', 'Freezer');

INSERT INTO products (
    product_name,
    product_brand,
    category_id,
    calories_per_100g,
    weight_grams,
    unit_type,
    is_halal,
    is_vegetarian,
    is_vegan
)
VALUES (
    'Baked Beans',
    'Heinz',
    1,
    78,
    415,
    'Tin',
    TRUE,
    TRUE,
    TRUE
);

INSERT INTO inventory (
    product_id,
	location_id,
    quantity,
    received_date,
    expiry_date,
    batch_number
)
VALUES (
    3,
	11,
    50,
    '2025-05-01',
    '2026-01-01',
    'BB001'
);


-- PostgreSQL SERIAL columns use sequence generators.
-- Sequence values are consumed when requested and are not reused if a transaction fails or rows are deleted. Therefore gaps in identifier values are expected behaviour and do not indicate missing data.