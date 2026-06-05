-- Show inventory with product names

SELECT
    p.product_name,
    i.quantity,
    l.location_name
FROM inventory i
JOIN products p
ON p.product_id = i.product_id
JOIN locations l
ON l.location_id = i.location_id;

SELECT
    p.product_name,
    p.product_brand,
    c.category_name,
    i.quantity,
    l.location_name,
    i.expiry_date
FROM inventory i
JOIN products p
    ON i.product_id = p.product_id
JOIN categories c
    ON p.category_id = c.category_id
JOIN locations l
    ON i.location_id = l.location_id;