-- Fetch all products
BEGIN TRANSACTION;
    LOCK TABLE products in SHARE MODE;
    CREATE OR REPLACE VIEW all_products AS
    SELECT * FROM products
COMMIT;

-- Get products ids
BEGIN TRANSACTION;
    LOCK TABLE products in SHARE MODE;
    CREATE OR REPLACE VIEW all_products_id AS
    SELECT id FROM products
COMMIT;

-- Get products count
BEGIN TRANSACTION;
    LOCK TABLE products in SHARE MODE;
    CREATE OR REPLACE VIEW products_count AS
    SELECT COUNT(*) FROM all_products_id
COMMIT;