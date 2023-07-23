BEGIN TRANSACTION;

-- Create products table with hash partitions on price
CREATE TABLE IF NOT EXISTS products (
    id SERIAL,
    title VARCHAR(256) NOT NULL,
    img VARCHAR(256),
    price INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    author_id INTEGER,
    posted_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (id, price),
    CONSTRAINT fk_products_author FOREIGN KEY (author_id, price) REFERENCES users(id, balance)
) PARTITION BY HASH (price);

-- Create the partition for products with price 0 to 99
CREATE TABLE IF NOT EXISTS products_price_0_99 PARTITION OF products
    FOR VALUES WITH (MODULUS 3, REMAINDER 0);

-- Create the partition for products with price 100 to 199
CREATE TABLE IF NOT EXISTS products_price_100_199 PARTITION OF products
    FOR VALUES WITH (MODULUS 3, REMAINDER 1);

-- Create the partition for products with price 200 to 299
CREATE TABLE IF NOT EXISTS products_price_200_299 PARTITION OF products
    FOR VALUES WITH (MODULUS 3, REMAINDER 2);

COMMIT;