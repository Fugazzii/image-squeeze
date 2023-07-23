BEGIN TRANSACTION;

-- Main users table
CREATE TABLE IF NOT EXISTS users (
    id serial,
    username VARCHAR(128),
    email VARCHAR(256),
    pwd VARCHAR(256),
    balance NUMERIC,
    PRIMARY KEY (id, balance)
) PARTITION BY RANGE (balance);

-- Partition for balances from 0 to 100
CREATE TABLE IF NOT EXISTS users_balance_0_100 PARTITION OF users
    FOR VALUES FROM (MINVALUE) TO (100);

-- Partition for balances from 100 to 1000
CREATE TABLE IF NOT EXISTS users_balance_100_1000 PARTITION OF users
    FOR VALUES FROM (100) TO (1000);

-- Partition for balances from 1000 to 10000
CREATE TABLE IF NOT EXISTS users_balance_1000_10000 PARTITION OF users
    FOR VALUES FROM (1000) TO (MAXVALUE);

COMMIT;