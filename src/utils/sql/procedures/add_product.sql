CREATE OR REPLACE PROCEDURE add_product(
    p_title VARCHAR(256),
    p_img VARCHAR(256),
    p_price INTEGER,
    p_quantity INTEGER,
    p_author_id INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO products (title, img, price, quantity, author_id)
    VALUES (p_title, p_img, p_price, p_quantity, p_author_id);

    EXCEPTION
        WHEN OTHERS THEN
            ROLLBACK;
            RAISE;
END;
$$;

-- call add_product('ilia tesli kaci', 'imgurl', 500, 100, 1);