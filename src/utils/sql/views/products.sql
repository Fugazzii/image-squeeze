-- Fetch all products
BEGIN TRANSACTION;
    CREATE OR REPLACE VIEW all_products AS
    SELECT id, title, img, price, quantity, author_id FROM products
COMMIT;

-- Get products ids
BEGIN TRANSACTION;
    CREATE OR REPLACE VIEW all_products_id AS
    SELECT id FROM products
COMMIT;

-- Get products count
BEGIN TRANSACTION;
    CREATE OR REPLACE VIEW products_count AS
    SELECT COUNT(*) FROM all_products_id
COMMIT;