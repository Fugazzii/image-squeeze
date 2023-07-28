BEGIN TRANSACTION;
    CREATE OR REPLACE VIEW all_products AS
    SELECT id, title, price, quantity, author_id FROM products;

    CREATE OR REPLACE VIEW product_images AS
    SELECT img_xl, img_l, img_m, img_s FROM products;

    CREATE OR REPLACE VIEW all_products_id AS
    SELECT id FROM products;

    CREATE OR REPLACE VIEW products_count AS
    SELECT COUNT(*) FROM all_products_id
COMMIT;