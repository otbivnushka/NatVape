const { Client } = require('pg');

const client = new Client({
    user: 'postgres',       // замени на своё имя пользователя
    host: 'localhost',
    database: 'db',  // замени на свою базу
    password: '2342',       // замени на свой пароль
    port: 5432,             // стандартный порт PostgreSQL
});

async function setupDatabase() {
    try {
        await client.connect();

        await client.query(`
            CREATE TABLE IF NOT EXISTS products (
                id SERIAL PRIMARY KEY,
                name TEXT,
                price INTEGER,
                category TEXT,
                types TEXT[],
                image TEXT
            );
        `);

        await client.query(`
            INSERT INTO products (name, price, category, types, image) VALUES
            ('HOTSPOT DOT', 15, 'liquids', 'images/products/hotspot-dot.jpg'),
            ('HOTSPOT FUEL', 15, 'liquids', 'images/products/hotspot-fuel.jpg'),
            ('HOTSPOT FUEL UP', 15, 'liquids', 'images/products/hotspot-fuel-up.jpg'),
            ('OGGO Sour', 20, 'liquids', 'images/products/oggo-sour.jpg'),
            ('PODONKI V1', 15, 'liquids', 'images/products/podonki-v1.jpg'),
            ('PODONKI VINTAGE', 15, 'liquids', 'images/products/podonki-vintage.jpg'),
            ('MALASIAN × PODONKI', 15, 'liquids', 'images/products/malasian-podonki-v1.jpg'),
            ('MALASIAN × PODONKI V2', 15, 'liquids', 'images/products/malasian-podonki-v2.jpg'),
            ('PODONKI × HYLINET', 15, 'liquids', 'images/products/podonki-xylinet.jpg'),
            ('CATSWILL', 17, 'liquids', 'images/products/catswill.jpg'),
            ('CATSWILL SOUR', 17, 'liquids', 'images/products/catswill-sour.jpg'),
            ('Rick & Morty На замерзоне', 15, 'liquids', 'images/products/rick-and-morty-na-zamerzone.jpg'),
            ('Protest', 13, 'liquids', 'images/products/protest.jpg'),
            ('СОЛЕВАЯ МОНАШКА', 20, 'liquids', 'images/products/solevaya-monashka.jpg'),
            ('ГРЕХ САМОУБИЙЦА', 20, 'liquids', 'images/products/greh-samoubitsa.jpg'),
            ('АНАРХИЯ', 20, 'liquids', 'images/products/anarchiya.jpg'),
            ('Xros', 13, 'cartridges', 'images/products/xros-cartrige.jpg'),
            ('V.thru', 13, 'cartridges', 'images/products/vthru-cartrige.jpg'),
            ('Knight 80/Pasito 2', 13, 'evaporators', 'images/products/pasito-evaporator.jpg'),
            ('B-serias', 13, 'evaporators', 'images/products/b-serias-evaporator.jpg'),
            ('ISTERIKA', 15, 'snus', 'images/products/isterika.jpg'),
            ('VOLKI', 15, 'snus', 'images/products/volki.jpg'),
            ('ISTERIKA 205mg', 20, 'snus', 'images/products/isterika-205.jpg'),
            ('Aegis Boost', 150, 'pods', 'images/products/aegis-boost.jpg'),
            ('Aedis Hero', 130, 'pods', 'images/products/aegis-hero.jpg'),
            ('HQD', 40, 'disposables', 'images/products/hqd.jpg'),
            ('HBD', 30, 'disposables', 'images/products/elfbar.png');
        `);

        console.log('Данные успешно добавлены в PostgreSQL');
    } catch (err) {
        console.error('Ошибка при работе с PostgreSQL:', err);
    } finally {
        await client.end();
    }
}

setupDatabase();
