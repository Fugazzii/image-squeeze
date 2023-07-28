CREATE OR REPLACE PROCEDURE add_product(
    p_title VARCHAR(256),
    p_img_xl VARCHAR(256),
    p_img_l VARCHAR(256),
    p_img_m VARCHAR(256),
    p_img_s VARCHAR(256),
    p_price INTEGER,
    p_quantity INTEGER,
    p_author_id INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO products (title, img_xl, img_l, img_m, img_s, price, quantity, author_id)
    VALUES (p_title, p_img_xl, p_img_l, p_img_m, p_img_s, p_price, p_quantity, p_author_id);

    EXCEPTION
        WHEN OTHERS THEN
            ROLLBACK;
            RAISE;
END;
$$;

-- drop procedure if exists add_product(VARCHAR,VARCHAR,VARCHAR,VARCHAR,VARCHAR, INTEGER,INTEGER,INTEGER);