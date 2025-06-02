CREATE DATABASE nv
WITH ENCODING = 'UTF8'
LC_COLLATE = 'C'       
LC_CTYPE = 'C'
TEMPLATE = template0;

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    image_url TEXT
);


CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    category_id INT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    image_url TEXT
);

CREATE TABLE product_types (
    id SERIAL PRIMARY KEY,
    product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL,
    available BOOLEAN DEFAULT TRUE,
    amount INT DEFAULT 0
);

CREATE TABLE carts (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL
);

CREATE TABLE cart_items (
    id SERIAL PRIMARY KEY,
    cart_id INT NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    product_type_id INT NOT NULL REFERENCES product_types(id) ON DELETE CASCADE,
    quantity INT NOT NULL DEFAULT 1
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    login VARCHAR(255) NOT NULL,
    chat_id INT NOT NULL
);

INSERT INTO categories (name, image_url) 
VALUES 
    ('Жидкости', 'images/categories/1.jpg'),
    ('Испарители', 'images/categories/2.jpg'),
    ('Картриджи', 'images/categories/3.jpg'),
    ('Снюс', 'images/categories/4.jpg'),
    ('Поды', 'images/categories/5.jpg'),
    ('Одноразки', 'images/categories/6.jpg');


INSERT INTO products (category_id, name, price, image_url) 
VALUES
    (8, 'HOTSPOT DOT', 15, 'images/products/hotspot-dot.jpg'),
    (8, 'HOTSPOT FUEL', 15, 'images/products/hotspot-fuel.jpg'),
    (8, 'HOTSPOT FUEL UP', 15, 'images/products/hotspot-fuel-up.jpg'),
    (8, 'OGGO Sour', 20, 'images/products/oggo-sour.jpg'),
    (8, 'PODONKI V1', 15, 'images/products/podonki-v1.jpg'),
    (8, 'PODONKI VINTAGE', 15, 'images/products/podonki-vintage.jpg'),
    (8, 'MALASIAN × PODONKI', 15, 'images/products/malasian-podonki-v1.jpg'),
    (8, 'MALASIAN × PODONKI V2', 15, 'images/products/malasian-podonki-v2.jpg'),
    (8, 'PODONKI × HYLINET', 15, 'images/products/podonki-xylinet.jpg'),
    (8, 'CATSWILL', 17, 'images/products/catswill.jpg'),
    (8, 'CATSWILL SOUR', 17, 'images/products/catswill-sour.jpg'),
    (8, 'Rick & Morty На замерзоне', 15, 'images/products/rick-and-morty-na-zamerzone.jpg'),
    (8, 'Protest', 13, 'images/products/protest.jpg'),
    (10, 'Xros', 13, 'images/products/xros-cartrige.jpg'),
    (10, 'V.thru', 13, 'images/products/vthru-cartrige.jpg'),
    (9, 'Knight 80/Pasito 2', 13, 'images/products/pasito-evaporator.jpg'),
    (9, 'B-serias', 13, 'images/products/b-serias-evaporator.jpg'),
    (11, 'ISTERIKA', 15, 'images/products/isterika.jpg'),
    (11, 'VOLKI', 15, 'images/products/volki.jpg'),
    (11, 'ISTERIKA 205mg', 20, 'images/products/isterika-205.jpg'),
    (12, 'Aegis Boost', 150, 'images/products/aegis-boost.jpg'),
    (12, 'Aedis Hero', 130, 'images/products/aegis-hero.jpg'),
    (13, 'HQD', 40, 'images/products/hqd.jpg'),
    (13, 'HBD', 30, 'images/products/elfbar.png');

UPDATE products SET category_id = $1, name = $2, price = $3, image_url = $4 WHERE id = $5 RETURNING *;

INSERT INTO product_types (product_id, type, available, amount) 
VALUES
    (50, 'Grey', true, 2),
    (50, 'Blue', true, 3),
    (50, 'Red', true, 4),
    (50, 'Green', true, 5);