-- Fetch all users
BEGIN TRANSACTION;
    CREATE OR REPLACE VIEW all_users AS
    SELECT username, email, balance FROM users
COMMIT;

-- Get users ids
BEGIN TRANSACTION;
    CREATE OR REPLACE VIEW all_users_id AS
    SELECT id FROM users
COMMIT;

-- Get users count
BEGIN TRANSACTION;
    CREATE OR REPLACE VIEW users_count AS
    SELECT COUNT(*) FROM all_users_id
COMMIT;