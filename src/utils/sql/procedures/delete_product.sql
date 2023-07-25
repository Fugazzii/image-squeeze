CREATE OR REPLACE PROCEDURE delete_product(
    p_product_id INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM products
    WHERE id = p_product_id;

    EXCEPTION
        WHEN OTHERS THEN
            ROLLBACK;
            RAISE;
END;
$$;