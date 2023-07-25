CREATE OR REPLACE PROCEDURE delete_user (
    IN p_user_id INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN

    DELETE FROM products
    WHERE author_id = p_user_id;

    DELETE FROM users
    WHERE id = p_user_id;

    EXCEPTION
        WHEN OTHERS THEN
            ROLLBACK;
            RAISE;
END;
$$;
