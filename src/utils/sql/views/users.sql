BEGIN TRANSACTION;
    CREATE OR REPLACE VIEW all_users AS
    SELECT id, username, email, balance FROM users;

    CREATE OR REPLACE VIEW all_users_id AS
    SELECT id FROM users;

    CREATE OR REPLACE VIEW users_count AS
    SELECT COUNT(*) FROM all_users_id;
COMMIT;