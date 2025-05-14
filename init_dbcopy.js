const { Client } = require('pg');

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'db',
    password: '2342',
    port: 5432,
});

async function setupDatabase() {
    try {
        await client.connect();

        // Создание таблиц
        await client.query(`
            CREATE TABLE IF NOT EXISTS products (
                id SERIAL PRIMARY KEY,
                name TEXT,
                price INTEGER,
                category TEXT,
                image TEXT
            );

            CREATE TABLE IF NOT EXISTS product_types (
                id SERIAL PRIMARY KEY,
                product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
                type TEXT,
                available BOOLEAN,
                amount INTEGER
            );
        `);

        // Вставка товаров
        await client.query(`
            DELETE FROM product_types;
            DELETE FROM products;

            INSERT INTO products (name, price, category, image) VALUES
            ('HOTSPOT DOT', 15, 'liquids', 'images/products/hotspot-dot.jpg'),
            ('HOTSPOT FUEL', 15, 'liquids', 'images/products/hotspot-fuel.jpg'),
            ('HOTSPOT FUEL UP', 15, 'liquids', 'images/products/hotspot-fuel-up.jpg'),
            ('OGGO Sour', 20, 'liquids', 'images/products/oggo-sour.jpg'),
            ('PODONKI V1', 15, 'liquids', 'images/products/podonki-v1.jpg'),
            ('PODONKI VINTAGE', 15, 'liquids', 'images/products/podonki-vintage.jpg'),
            ('MALASIAN × PODONKI', 15, 'liquids', 'images/products/malasian-podonki-v1.jpg'),
            ('MALASIAN × PODONKI V2', 15, 'liquids', 'images/products/malasian-podonki-v2.jpg'),
            ('PODONKI × HYLINET', 15, 'liquids', 'images/products/podonki-xylinet.jpg'),
            ('PODONLI LAST HAP', 15, 'liquids', 'images/products/podonki-xylinet.jpg'),
            ('CATSWILL', 17, 'liquids', 'images/products/catswill.jpg'),
            ('CATSWILL SOUR', 17, 'liquids', 'images/products/catswill-sour.jpg'),
            ('CATSWILL DOTA', 17, 'liquids', 'images/products/catswill-sour.jpg'),
            ('Rick & Morty На замерзоне', 15, 'liquids', 'images/products/rick-and-morty-na-zamerzone.jpg'),
            ('Protest', 13, 'liquids', 'images/products/protest.jpg'),
            ('СОЛЕВАЯ МОНАШКА', 20, 'liquids', 'images/products/solevaya-monashka.jpg'),
            ('ГРЕХ САМОУБИЙЦА', 20, 'liquids', 'images/products/greh-samoubitsa.jpg'),
            ('FREEZE MONKEY MAX FLAVOR', 20, 'liquids', 'images/products/greh-samoubitsa.jpg'),
            ('АНАРХИЯ', 20, 'liquids', 'images/products/anarchiya.jpg'),
            ('Картридж Xros', 13, 'cartridges', 'images/products/xros-cartrige.jpg'),
            ('Картридж V.thru', 13, 'cartridges', 'images/products/vthru-cartrige.jpg'),
            ('Испаритель Knight 80/Pasito 2', 13, 'evaporators', 'images/products/pasito-evaporator.jpg'),
            ('Испаритель B-serias', 13, 'evaporators', 'images/products/b-serias-evaporator.jpg'),
            ('ISTERIKA', 15, 'snus', 'images/products/isterika.jpg'),
            ('VOLKI', 15, 'snus', 'images/products/volki.jpg'),
            ('ISTERIKA 205mg', 20, 'snus', 'images/products/isterika-205.jpg'),
            ('Aegis Boost', 150, 'pods', 'images/products/aegis-boost.jpg'),
            ('Aedis Hero', 130, 'pods', 'images/products/aegis-hero.jpg'),
            ('HQD', 40, 'disposables', 'images/products/hqd.jpg'),
            ('HBD', 30, 'disposables', 'images/products/elfbar.png');
        `);

        // Получим id нужного товара
        const { rows: productRows } = await client.query(`SELECT id, name FROM products`);
        const productMap = {};
        for (const row of productRows) {
            productMap[row.name] = row.id;
        }

        // Вкусы для продуктов
        const productTypesData = [
            {
                productName: 'HOTSPOT DOT',
                types: [
                    { type: 'Ананас яблоко', available: false, amount: 0 },
                    { type: 'Малина смородина', available: true, amount: 4 },
                    { type: 'Клубника мята', available: true, amount: 1 },
                    { type: 'Манго мандарин', available: false, amount: 0 },
                    { type: 'Нектарин вишня', available: true, amount: 4 },
                    { type: 'Банан лайм', available: true, amount: 10 }
                ]
            },
            {
                productName: 'HOTSPOT FUEL',
                types: [
                    { type: 'Манго грейпфрут', available: true, amount: 10 },
                    { type: 'Кислые лесные ягоды', available: true, amount: 4 },
                    { type: 'Ананас кокос', available: false, amount: 0 },
                    { type: 'Киви помело', available: false, amount: 0 },
                    { type: 'Киви банан', available: true, amount: 9 },
                    { type: 'Брусника лимон', available: false, amount: 0 },
                    { type: 'Манго персик', available: false, amount: 0 },
                    { type: 'Свежая перечная мята', available: false, amount: 0 },
                    { type: 'Личи лайм', available: true, amount: 9 },
                    { type: 'Хвоя грейпфрут', available: false, amount: 0 },
                    { type: 'Яблоко груша', available: false, amount: 0 },
                    { type: 'Смородина мята', available: false, amount: 0 },
                    { type: 'Ананас ежевика', available: false, amount: 0 },
                    { type: 'Персик маракуйя', available: true, amount: 1 },
                    { type: 'Дыня черника', available: false, amount: 0 }
                ]
            },
            {
                productName: 'PODONKI V1',
                types: [
                    { type: 'Жвачка абрикос', available: false, amount: 0 },
                    { type: 'Малиново-клубничная жвачка', available: true, amount: 5 },
                    { type: 'Хвоя лесные ягоды лед', available: true, amount: 8 },
                    { type: 'Вишня яблоко', available: false, amount: 0 },
                    { type: 'Банан клубника лед', available: true, amount: 4 },
                    { type: 'Малиновый лимонад со льдом', available: false, amount: 0 },
                    { type: 'Смородиновый лимонад', available: true, amount: 2 },
                    { type: 'Двойное яблоко и лед', available: true, amount: 1 },
                    { type: 'Классическая кола со льдом', available: false, amount: 0 },
                    { type: 'Бабл гам с арбузной мятой', available: false, amount: 0 },
                    { type: 'Брусника клюква малина', available: true, amount: 3 },
                    { type: 'Ледяной личи виноград и мята', available: false, amount: 0 },
                    { type: 'Вишня лайм лед', available: true, amount: 10 },
                    { type: 'Черника малина мята лед', available: true, amount: 2 },
                    { type: 'Лесные ягоды со льдом', available: true, amount: 3 },
                    { type: 'Малина и вишня', available: true, amount: 3 },
                    { type: 'Тропические фрукты со льдом', available: true, amount: 1 }
                ]
            },
            {
                productName: 'PODONKI VINTAGE',
                types: [
                    { type: 'Ежевичный лимонад', available: false, amount: 0 },
                    { type: 'Клюквенная газировка', available: true, amount: 9 },
                    { type: 'Морс черника виноград', available: true, amount: 8 },
                    { type: 'Освежающий лимонад', available: true, amount: 7 },
                    { type: 'Смородиновый лимонад', available: true, amount: 9 },
                    { type: 'Яблочный лимонад', available: true, amount: 6 },
                    { type: 'Брусничный морс', available: true, amount: 5 },
                    { type: 'Клубничный мохито', available: false, amount: 0 },
                    { type: 'Апельсиновая газировка', available: true, amount: 10 },
                    { type: 'Мармеладный джин', available: false, amount: 0 },
                    { type: 'Земляничный мусс', available: true, amount: 8 },
                    { type: 'Малиновый пунш', available: true, amount: 6 },
                    { type: 'Пина колада с грушей', available: true, amount: 9 },
                    { type: 'Виноградная газировка', available: false, amount: 0 },
                    { type: 'Юппи ананас со льдом', available: true, amount: 7 }
                ]
            },
            {
                productName: 'MALASIAN x PODONKI V1',
                types: [
                    { type: 'Малина клубника черная и красная смородина', available: false, amount: 0 },
                    { type: 'Черника малина лимон', available: true, amount: 8 },
                    { type: 'Вишня ананас', available: true, amount: 9 },
                    { type: 'Мармеладные мишки с мандарином и лимоном', available: false, amount: 0 },
                    { type: 'Манго гуава маракуйя', available: false, amount: 0 },
                    { type: 'Жвачка клубника киви', available: true, amount: 7 },
                    { type: 'Розовый лимонад', available: true, amount: 10 },
                    { type: 'Маракуйя гуава апельсин', available: false, amount: 0 },
                    { type: 'Виноград клубника', available: false, amount: 0 },
                    { type: 'Черника смородина малина анис ментол', available: true, amount: 5 }
                ]
            },
            {
                productName: 'Rick & Morty на замерзоне',
                types: [
                    { type: 'Лимонад виноград вишня', available: false, amount: 0 },
                    { type: 'Кислые чернично-малиновые червячки', available: false, amount: 0 },
                    { type: 'Кислый скитлс', available: false, amount: 0 },
                    { type: 'Ягодная жвачка', available: false, amount: 0 },
                    { type: 'Клубника арбуз', available: false, amount: 0 },
                    { type: 'Дыня персик', available: false, amount: 0 },
                    { type: 'Морс', available: true, amount: 8 },
                    { type: 'Мятный бабл гам', available: false, amount: 0 },
                    { type: 'Кислый ананас апельсин', available: false, amount: 0 },
                    { type: 'Пинаколада', available: false, amount: 0 },
                    { type: 'Спрайт', available: false, amount: 0 },
                    { type: 'Кислый малиново-грейпфрутовый швепс', available: true, amount: 7 },
                    { type: 'Барбарисовый лимонад', available: false, amount: 0 },
                    { type: 'Киви маракуйя гуава', available: false, amount: 0 },
                    { type: 'Гранатовый мармелад', available: true, amount: 6 },
                    { type: 'Клубничный коктейль', available: false, amount: 0 },
                    { type: 'Яблочный энергетик', available: false, amount: 0 },
                    { type: 'Земляника виноград', available: false, amount: 0 },
                    { type: 'Кислые вишневые червячки', available: false, amount: 0 },
                    { type: 'Черничная фанта', available: false, amount: 0 },
                    { type: 'Клубника ежевика', available: false, amount: 0 },
                    { type: 'Клубничная фанта', available: false, amount: 0 },
                    { type: 'Розовый лимонад', available: true, amount: 10 },
                    { type: 'Манго драгонфрут', available: false, amount: 0 },
                    { type: 'Клюква земляника', available: false, amount: 0 },
                    { type: 'Тропический банан', available: true, amount: 5 },
                    { type: 'Кислый лайм арбуз', available: false, amount: 0 },
                    { type: 'Виноградный холс', available: false, amount: 0 },
                    { type: 'Бузина маракуйя', available: false, amount: 0 },
                    { type: 'Клюква лайм', available: false, amount: 0 },
                    { type: 'Персик кактус', available: false, amount: 0 },
                    { type: 'Грейпфрут черная смородина', available: false, amount: 0 },
                    { type: 'Мятное мороженое', available: true, amount: 9 },
                    { type: 'Молочный улун', available: false, amount: 0 },
                    { type: 'Личи фейхоа', available: false, amount: 0 },
                    { type: 'Манго арбуз', available: false, amount: 0 },
                    { type: 'Роза личи', available: true, amount: 7 },
                    { type: 'Кола вишня', available: false, amount: 0 },
                    { type: 'Ягодный пунш', available: false, amount: 0 },
                    { type: 'Красный апельсин', available: true, amount: 6 },
                    { type: 'Малиновый мармелад', available: false, amount: 0 },
                    { type: 'Маракуйя мандарин', available: true, amount: 8 },
                    { type: 'Двойной манго', available: true, amount: 9 },
                    { type: 'Черника молоко', available: false, amount: 0 },
                    { type: 'Кокос дыня', available: false, amount: 0 },
                    { type: 'Хвоя лесные ягоды', available: false, amount: 0 },
                    { type: 'Алоэ виноград', available: false, amount: 0 },
                    { type: 'Гуава ананас', available: false, amount: 0 },
                    { type: 'Банан клубника', available: true, amount: 10 },
                    { type: 'Айс латте', available: false, amount: 0 },
                    { type: 'Арбузная жвачка', available: false, amount: 0 },
                    { type: 'Черная смородина лимонад', available: false, amount: 0 },
                    { type: 'Клубника киви', available: false, amount: 0 },
                    { type: 'Ягодный энергетик', available: false, amount: 0 },
                    { type: 'Смородина виноград', available: false, amount: 0 },
                    { type: 'Яблоко киви', available: false, amount: 0 },
                    { type: 'Малина ежевика', available: false, amount: 0 }
                ]
            },
            {
                productName: 'Картридж Xros',
                types: [
                    { type: '0.4 omh', available: true, amount: 8 },
                    { type: '0.6 omh', available: true, amount: 6 },
                    { type: '0.8 omh', available: false, amount: 0 }
                ]
            },
            {
                productName: 'Картридж V.thru',
                types: [
                    { type: '0.4 omh', available: true, amount: 7 },
                    { type: '0.7 omh', available: true, amount: 6 }
                ]
            },
            {
                productName: 'ГРЕХ САМОУБИЙЦА',
                types: [
                    { type: 'Земляника черника', available: false, amount: 0 },
                    { type: 'Манго ананас', available: true, amount: 9 },
                    { type: 'Киви с яблоком', available: true, amount: 7 },
                    { type: 'Медовая дыня с арбузом', available: true, amount: 6 },
                    { type: 'Кокос ананас', available: true, amount: 8 },
                    { type: 'Апельсин грейпфрут', available: true, amount: 6 },
                    { type: 'Спелая малина с вишней', available: false, amount: 0 },
                    { type: 'Зеленый виноград с киви', available: false, amount: 0 },
                    { type: 'Вишневый компот', available: true, amount: 7 },
                    { type: 'Скитлс', available: false, amount: 0 },
                    { type: 'Брусника клюква малина', available: true, amount: 8 },
                    { type: 'Кислые дикие ягоды', available: true, amount: 9 },
                    { type: 'Вишня персик мята', available: true, amount: 10 },
                    { type: 'Малина черника клюква', available: true, amount: 7 },
                    { type: 'Яблоко земляника', available: true, amount: 6 },
                    { type: 'Смородина виноград', available: true, amount: 8 },
                    { type: 'Экзотический микс', available: true, amount: 7 },
                    { type: 'Нектарин дыня', available: true, amount: 6 },
                    { type: 'Вишня красная смородина', available: true, amount: 8 },
                    { type: 'Клубника смородина мята', available: true, amount: 9 }
                ]
            },
            {
                productName: 'АНАРХИЯ',
                types: [
                    { type: 'Сладко-цитрусовый вкус белого монстра', available: false, amount: 0 },
                    { type: 'Сладкая алая клубника с холодом', available: false, amount: 0 },
                    { type: 'Компот из сочных персиков', available: false, amount: 0 },
                    { type: 'Вафли с банановым кремом и кусочками клубники', available: false, amount: 0 },
                    { type: 'Сок из манго клубники и персика', available: false, amount: 0 },
                    { type: 'Банан с клубникой и сливками', available: false, amount: 0 },
                    { type: 'Холодный лесной виноград', available: false, amount: 0 },
                    { type: 'Холодная сладкая мята', available: true, amount: 8 },
                    { type: 'Ванильно-творожный сырочек', available: true, amount: 7 },
                    { type: 'Холодный апельсиново-мандариновый сок', available: false, amount: 0 },
                    { type: 'Сладкая клубника со сливками', available: false, amount: 0 },
                    { type: 'Радужный щербет', available: true, amount: 9 },
                    { type: 'Пшеничнoе печенье с ванильным кремом', available: true, amount: 8 },
                    { type: 'Ананасовый джем с сочным холодным манго', available: true, amount: 7 },
                    { type: 'Лимонно-лаймовый лимонад с холодком', available: false, amount: 0 },
                    { type: 'Чизкейк с апельсиновым и баварским кремом', available: true, amount: 9 },
                    { type: 'Зеленое яблоко', available: false, amount: 0 },
                    { type: 'Кисло-сладкое зеленое яблоко', available: false, amount: 0 },
                    { type: 'Лимонно-лаймовая кола', available: true, amount: 6 },
                    { type: 'Сочный личи с белым персиком', available: false, amount: 0 },
                    { type: 'Холодный арбузный сок', available: false, amount: 0 }
                ]
            },
            {
                productName: 'Испаритель Knight 80/Pasito 2',
                types: [
                    { type: '0,3 Ом', available: false, amount: 0 },
                    { type: '0,4 Ом', available: true, amount: 6 }
                ]
            },
            {
                productName: 'PODINKI × HYLINET',
                types: [
                    { type: 'Мохито', available: false, amount: 0 },
                    { type: 'Бабл Гам', available: false, amount: 0 },
                    { type: 'Зеленый Чай', available: false, amount: 0 },
                    { type: 'Малина Личи', available: false, amount: 0 },
                    { type: 'Арбуз Малина', available: false, amount: 0 },
                    { type: 'Манго Персик', available: false, amount: 0 },
                    { type: 'Ягодный Микс', available: false, amount: 0 },
                    { type: 'Алоэ Виноград', available: false, amount: 0 },
                    { type: 'Арбузная Мята', available: false, amount: 0 },
                    { type: 'Вишневый Фреш', available: false, amount: 0 },
                    { type: 'Мятная Жвачка', available: true, amount: 7 },
                    { type: 'Банан Карамель', available: false, amount: 0 },
                    { type: 'Манго Маракуйя', available: false, amount: 0 },
                    { type: 'Пунш Кокосовый', available: false, amount: 0 },
                    { type: 'Ананас Клубника', available: false, amount: 0 },
                    { type: 'Виноградный Лед', available: false, amount: 0 },
                    { type: 'Мусс Клубничный', available: false, amount: 0 },
                    { type: 'Арбузная Конфета', available: false, amount: 0 },
                    { type: 'Грушевый Лимонад', available: false, amount: 0 },
                    { type: 'Черничный Йогурт', available: false, amount: 0 },
                    { type: 'Грейпберри Фьюжин', available: false, amount: 0 },
                    { type: 'Смородина Черника', available: false, amount: 0 },
                    { type: 'Виноград Малина Киви', available: false, amount: 0 },
                    { type: 'Фруктовые Мармеладки', available: false, amount: 0 },
                    { type: 'Грейпфрутовый Энергетик', available: false, amount: 0 }
                ]
            },
            {
                productName: 'ISTERIKA',
                types: [
                    { type: 'Dr.papper', available: false, amount: 0 },
                    { type: 'Апельсиновый фреш', available: false, amount: 0 },
                    { type: 'Арбузный смузи', available: false, amount: 0 },
                    { type: 'Бабл гам', available: false, amount: 0 },
                    { type: 'Банан', available: false, amount: 0 },
                    { type: 'Изумрудный виноград', available: false, amount: 0 },
                    { type: 'Кислая вишня', available: false, amount: 0 },
                    { type: 'Медовая дыня', available: false, amount: 0 },
                    { type: 'Мята', available: false, amount: 0 },
                    { type: 'Спрайт со льдом', available: false, amount: 0 },
                    { type: 'Тройное яблоко', available: false, amount: 0 },
                    { type: 'Тропические фрукты', available: false, amount: 0 }
                ]
            },
            {
                productName: 'VOLKI',
                types: [
                    { type: 'Яблоко', available: false, amount: 0 },
                    { type: 'Вишня', available: false, amount: 0 },
                    { type: 'Тутти фрути', available: false, amount: 0 },
                    { type: 'Кола', available: false, amount: 0 },
                    { type: 'Мята', available: false, amount: 0 }
                ]
            },
            {
                productName: 'CATSWILL',
                types: [
                    { type: 'Мятная жвачка', available: true, amount: 8 },
                    { type: 'Клубника жвачка банан', available: false, amount: 0 },
                    { type: 'Виноград изабелла алоэ', available: false, amount: 0 },
                    { type: 'Клубнично вишневая конфета', available: false, amount: 0 },
                    { type: 'Скитлс с виноградом изабелла', available: false, amount: 0 },
                    { type: 'Манго сода виноград', available: false, amount: 0 },
                    { type: 'Йогурт клубника маракуйя', available: false, amount: 0 },
                    { type: 'Кислый малиновый скитлс', available: false, amount: 0 },
                    { type: 'Вишня персик мята', available: false, amount: 0 },
                    { type: 'Кислая фруктовая жвачка', available: false, amount: 0 },
                    { type: 'Манго мамба апельсин', available: true, amount: 7 },
                    { type: 'Чернично арбузная хубба-бубба', available: false, amount: 0 },
                    { type: 'Имбирный лимонад с малиной', available: false, amount: 0 },
                    { type: 'Черничный лимонад с малиной', available: false, amount: 0 },
                    { type: 'Клубника виноград мята', available: false, amount: 0 },
                    { type: 'Доктор пеппер со сладким апельсином', available: false, amount: 0 },
                    { type: 'Чай с малиной и мятой', available: false, amount: 0 },
                    { type: 'Лимонад черника лайм', available: false, amount: 0 },
                    { type: 'Мамба кислое яблоко-киви', available: false, amount: 0 },
                    { type: 'Клубнично арбузная хубба-бубба', available: false, amount: 0 },
                    { type: 'Газировка маунтин дью с вишней', available: false, amount: 0 },
                    { type: 'Арбузный пунш с малиной и клубникой', available: false, amount: 0 },
                    { type: 'Энергетик с черникой', available: false, amount: 0 },
                    { type: 'Лимонад ежевика сироп', available: false, amount: 0 },
                    { type: 'Айрн брю с долькой апельсина', available: true, amount: 7 },
                    { type: 'Ананасовый сироп с виноградом лёд', available: false, amount: 0 },
                    { type: 'Виноград мята', available: false, amount: 0 },
                    { type: 'Кислый виноградный чупа чупс', available: false, amount: 0 },
                    { type: 'Кислые яблочные червячки', available: false, amount: 0 },
                    { type: 'Кислый скитлс', available: false, amount: 0 },
                    { type: 'Вишневые леденцы', available: false, amount: 0 },
                    { type: 'Киви лёд кислинка', available: false, amount: 0 },
                    { type: 'Кислые червячки с малиной и черешней', available: false, amount: 0 },
                    { type: 'Клубника киви', available: false, amount: 0 },
                    { type: 'Чернично клубничный фреш', available: false, amount: 0 },
                    { type: 'Морозные лесные ягоды', available: false, amount: 0 },
                    { type: 'Малина лед ежевика', available: false, amount: 0 },
                    { type: 'Черника лед ежевика', available: false, amount: 0 },
                    { type: 'Мятная вишня', available: false, amount: 0 }
                ]
            },
            {
                productName: 'Испаритель B-serias',
                types: [
                    { type: 'Сопротивление: 0.3 Ом', available: false, amount: 0 },
                    { type: 'Сопротивление 0.2 Ом', available: true, amount: 6 }
                ]
            },
            {
                productName: 'HOTSPOT FUEL UP',
                types: [
                    { type: 'Клюква Киви', available: false, amount: 0 },
                    { type: 'Манго Банан Ментол', available: false, amount: 0 },
                    { type: 'Лимон Маракуйя Лемонграсс', available: false, amount: 0 },
                    { type: 'Гуава Морошка', available: false, amount: 0 },
                    { type: 'Тархун Дыня Помело', available: false, amount: 0 },
                    { type: 'Ананас Лайм Земляника', available: false, amount: 0 },
                    { type: 'Грейпфрут Малина Виноград', available: false, amount: 0 },
                    { type: 'Крыжовник Барбарис', available: false, amount: 0 },
                    { type: 'Зеленая Мята Персик Кактус', available: false, amount: 0 },
                    { type: 'Зефир Кокос Черная Смородина', available: true, amount: 7 }
                ]
            },
            {
                productName: 'MALASIAN x PODONKI V2',
                types: [
                    { type: 'Киви-ананас', available: false, amount: 0 },
                    { type: 'Грейпфрут-гуава', available: true, amount: 7 },
                    { type: 'Мармеладные мишки-кола', available: true, amount: 6 },
                    { type: 'Манго-клубника', available: true, amount: 6 },
                    { type: 'Арбуз-маракуйя', available: true, amount: 6 },
                    { type: 'Черника-смородина', available: true, amount: 7 },
                    { type: 'Малина-ежевика', available: true, amount: 6 },
                    { type: 'Виноградный лимонад', available: true, amount: 6 },
                    { type: 'Яблоко-черешня', available: true, amount: 6 },
                    { type: 'Банан-маракуйя', available: true, amount: 6 }
                ]
            },
            {
                productName: 'Protest',
                types: [
                    { type: 'Черника + Смородина', available: false, amount: 0 },
                    { type: 'Черника + Дыня', available: false, amount: 0 },
                    { type: 'Клюквенный Энергетик', available: false, amount: 0 },
                    { type: 'Виноградный Газировка', available: false, amount: 0 },
                    { type: 'Киви + Арбуз', available: false, amount: 0 },
                    { type: 'Лимон + Гранат + Малина', available: true, amount: 7 },
                    { type: 'Мандариновый Сорбет', available: true, amount: 6 },
                    { type: 'Ананс + Ежевика', available: false, amount: 0 },
                    { type: 'Земляника + Лайм', available: true, amount: 6 },
                    { type: 'Тик-Так Лимонная Мята', available: true, amount: 6 }
                ]
            },
            {
                productName: 'CATSWILL SOUR',
                types: [
                    { type: 'Кислые желатинки с маракуей и ананасом', available: true, amount: 7 },
                    { type: 'Кислый грейпфрут с вишней', available: true, amount: 6 },
                    { type: 'Кислые ленточки с маракуей и манго', available: true, amount: 6 },
                    { type: 'Кислые яблочно-лимонные колечки', available: true, amount: 6 },
                    { type: 'Кислое харибо с колой и черешней', available: false, amount: 0 },
                    { type: 'Кислый лимонад из арбуза лайма и Малины', available: false, amount: 0 },
                    { type: 'Кислый леденец с виноградом киви и яблоком', available: true, amount: 6 },
                    { type: 'Фанта апельсин с кислой малиной', available: true, amount: 6 },
                    { type: 'Кислая яблочно-клубничная шипучка', available: true, amount: 6 },
                    { type: 'Кислые дольки с персиком и клубникой', available: false, amount: 0 },
                    { type: 'Кислая Фанта с черникой', available: true, amount: 6 }
                ]
            },
            {
                productName: 'Isterika 205mg',
                types: [
                    { type: 'Фрутелла', available: false, amount: 0 },
                    { type: 'Кислый скитлс', available: false, amount: 0 },
                    { type: 'Малина смородина', available: false, amount: 0 },
                    { type: 'Клубничный коктейль', available: false, amount: 0 },
                    { type: 'Энергетик киви', available: false, amount: 0 },
                    { type: 'Ледяная мята', available: true, amount: 7 }
                ]
            },
            {
                productName: 'OGGO Sour',
                types: [
                    { type: 'Кислое киви', available: false, amount: 0 },
                    { type: 'Кислое яблоко', available: false, amount: 0 },
                    { type: 'Кислая маракуя', available: false, amount: 0 },
                    { type: 'Кислый грейпфрут и чёрная смородина', available: true, amount: 7 },
                    { type: 'Кислый ананас малина', available: false, amount: 0 }
                ]
            },
            {
                productName: 'СОЛЕВАЯ МОНАШКА',
                types: [
                    { type: 'Ванильный панкейк с клубникой и сливками', available: true, amount: 6 }
                ]
            },
            {
                productName: 'PODONKI PODGON',
                types: [
                    { type: 'Кокос малина', available: true, amount: 6 },
                    { type: 'Брусника в сахаре', available: true, amount: 7 },
                    { type: 'Зеленый манго', available: true, amount: 7 },
                    { type: 'Грейпфрутовый лимонад', available: true, amount: 7 },
                    { type: 'Персиковый йогурт', available: true, amount: 6 }
                ]
            },
            {
                productName: 'FREEZE MONKEY MAX FLAVOR',
                types: [
                    { type: 'Ягодный йогурт', available: true, amount: 6 },
                    { type: 'Груша', available: true, amount: 6 },
                    { type: 'Груша яблоко', available: true, amount: 7 },
                    { type: 'Клубника ананас', available: true, amount: 6 },
                    { type: 'Гуава', available: true, amount: 7 }
                ]
            },
            {
                productName: 'PODONKI LAST HAP',
                types: [
                    { type: 'Вафли с клубничным сиропом', available: true, amount: 7 },
                    { type: 'Черно-смородиновый мармелад', available: false, amount: 0 },
                    { type: 'Малиновый энергетик', available: false, amount: 0 },
                    { type: 'Вишня с варёной сгущенкой', available: false, amount: 0 },
                    { type: 'Лемонграсс малина', available: true, amount: 7 },
                    { type: 'Кокосовое мороженое', available: false, amount: 0 },
                    { type: 'Мятные конфетки холс', available: true, amount: 6 },
                    { type: 'Яблочные мармеладные червячки', available: false, amount: 0 },
                    { type: 'Смородиновый скитлс', available: false, amount: 0 },
                    { type: 'Зеленый манго и смородина', available: false, amount: 0 },
                    { type: 'Арбузный милкшейк', available: true, amount: 7 },
                    { type: 'Виноградные конфетки', available: false, amount: 0 },
                    { type: 'Вишня персик', available: false, amount: 0 },
                    { type: 'Грейпфрутовый лимонад', available: false, amount: 0 },
                    { type: 'Апельсин манго гуава', available: true, amount: 7 }
                ]
            },
            {
                productName: 'CATSWILL DOTA',
                types: [
                    { type: 'SHADOW FIEND', available: true, amount: 6 },
                    { type: 'MEEPO', available: true, amount: 7 },
                    { type: 'URSA', available: true, amount: 6 },
                    { type: 'TEMPLAR', available: true, amount: 6 },
                    { type: 'STORM SPIRIT', available: true, amount: 6 },
                    { type: 'ROSHAN', available: false, amount: 0 },
                    { type: 'PUDGE', available: true, amount: 6 },
                    { type: 'NECROPHOS', available: false, amount: 0 },
                    { type: 'NATURE\'S PROPHET', available: true, amount: 6 },
                    { type: 'MONKEY KING', available: true, amount: 6 },
                    { type: 'WINDRANGER', available: true, amount: 6 },
                    { type: 'LEGION COMMANDER', available: true, amount: 6 },
                    { type: 'HUSKAR', available: true, amount: 6 },
                    { type: 'DEATH PROPHET', available: true, amount: 6 },
                    { type: 'BONTY HUNTER', available: true, amount: 6 }
                ]
            },   
        ];
        

        // Вставка типов
        for (const product of productTypesData) {
            const productId = productMap[product.productName];
            if (!productId) continue;

            for (const type of product.types) {
                await client.query(`
                    INSERT INTO product_types (product_id, type, available, amount)
                    VALUES ($1, $2, $3, $4);
                `, [productId, type.type, type.available, type.amount]);
            }
        }

        console.log('База успешно инициализирована!');
    } catch (err) {
        console.error('Ошибка при работе с PostgreSQL:', err);
    } finally {
        await client.end();
    }
}

setupDatabase();
