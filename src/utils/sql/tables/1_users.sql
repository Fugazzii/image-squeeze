BEGIN TRANSACTION;

-- Main users table
CREATE TABLE IF NOT EXISTS users (
    id serial PRIMARY KEY,
    username VARCHAR(128),
    email VARCHAR(256),
    pwd VARCHAR(256),
    balance INTEGER
) PARTITION BY RANGE (id);

-- Partition for ids from 0 to 100
CREATE TABLE IF NOT EXISTS users_id_0_100 PARTITION OF users
    FOR VALUES FROM (MINVALUE) TO (100);

-- Partition for ids from 100 to 1000
CREATE TABLE IF NOT EXISTS users_id_100_1000 PARTITION OF users
    FOR VALUES FROM (100) TO (1000);

-- Partition for ids from 1000 to 10000
CREATE TABLE IF NOT EXISTS users_id_1000_10000 PARTITION OF users
    FOR VALUES FROM (1000) TO (MAXVALUE);

COMMIT;