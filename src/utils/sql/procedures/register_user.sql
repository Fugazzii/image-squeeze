CREATE OR REPLACE PROCEDURE register_new_user (
    IN p_username VARCHAR(128),
    IN p_email VARCHAR(256),
    IN p_pwd VARCHAR(256),
    IN p_balance NUMERIC
)
LANGUAGE plpgsql
AS $$
BEGIN

    LOCK TABLE users IN EXCLUSIVE MODE;

    INSERT INTO users (username, email, pwd, balance)
    VALUES (p_username, p_email, p_pwd, p_balance);

    EXCEPTION
        WHEN OTHERS THEN
            ROLLBACK;
            RAISE;  
END;
$$;