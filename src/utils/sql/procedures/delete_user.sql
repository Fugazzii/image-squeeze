CREATE OR REPLACE PROCEDURE delete_user_from_email (
    IN p_user_email INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN

    LOCK TABLE users IN EXCLUSIVE MODE;

    DELETE FROM users
    WHERE email = p_user_email;

    EXCEPTION
        WHEN OTHERS THEN
            ROLLBACK;
            RAISE;
END;
$$;

CREATE OR REPLACE PROCEDURE delete_user (
    IN p_user_id INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN

    LOCK TABLE users IN EXCLUSIVE MODE;

    DELETE FROM users
    WHERE id = p_user_id;


    EXCEPTION
        WHEN OTHERS THEN
            ROLLBACK;
            RAISE;
END;
$$;
