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



########################################################################




INSERT INTO product_types (product_id, type, available, amount)
VALUES
    (25, 'Ананас яблоко', false, 0),
    (25, 'Малина смородина', true, 4),
    (25, 'Клубника мята', true, 1),
    (25, 'Манго мандарин', false, 0),
    (25, 'Нектарин вишня', true, 4),
    (25, 'Банан лайм', true, 10);

INSERT INTO product_types (product_id, type, available, amount)
VALUES
    (26, 'Манго грейпфрут', true, 10),
    (26, 'Кислые лесные ягоды', true, 4),
    (26, 'Ананас кокос', false, 0),
    (26, 'Киви помело', false, 0),
    (26, 'Киви банан', true, 9),
    (26, 'Брусника лимон', false, 0),
    (26, 'Манго персик', false, 0),
    (26, 'Свежая перечная мята', false, 0),
    (26, 'Личи лайм', true, 9),
    (26, 'Хвоя грейпфрут', false, 0),
    (26, 'Яблоко груша', false, 0),
    (26, 'Смородина мята', false, 0),
    (26, 'Ананас ежевика', false, 0),
    (26, 'Персик маракуйя', true, 1),
    (26, 'Дыня черника', false, 0);

INSERT INTO product_types (product_id, type, available, amount)
VALUES
    (29, 'Жвачка абрикос', false, 0),
    (29, 'Малиново-клубничная жвачка', true, 5),
    (29, 'Хвоя лесные ягоды лед', true, 8),
    (29, 'Вишня яблоко', false, 0),
    (29, 'Банан клубника лед', true, 4),
    (29, 'Малиновый лимонад со льдом', false, 0),
    (29, 'Смородиновый лимонад', true, 2),
    (29, 'Двойное яблоко и лед', true, 1),
    (29, 'Классическая кола со льдом', false, 0),
    (29, 'Бабл гам с арбузной мятой', false, 0),
    (29, 'Брусника клюква малина', true, 3),
    (29, 'Ледяной личи виноград и мята', false, 0),
    (29, 'Вишня лайм лед', true, 10),
    (29, 'Черника малина мята лед', true, 2),
    (29, 'Лесные ягоды со льдом', true, 3),
    (29, 'Малина и вишня', true, 3),
    (29, 'Тропические фрукты со льдом', true, 1);

INSERT INTO product_types (product_id, type, available, amount)
VALUES
    (30, 'Ежевичный лимонад', false, 0),
    (30, 'Клюквенная газировка', true, 9),
    (30, 'Морс черника виноград', true, 8),
    (30, 'Освежающий лимонад', true, 7),
    (30, 'Смородиновый лимонад', true, 9),
    (30, 'Яблочный лимонад', true, 6),
    (30, 'Брусничный морс', true, 5),
    (30, 'Клубничный мохито', false, 0),
    (30, 'Апельсиновая газировка', true, 10),
    (30, 'Мармеладный джин', false, 0),
    (30, 'Земляничный мусс', true, 8),
    (30, 'Малиновый пунш', true, 6),
    (30, 'Пина колада с грушей', true, 9),
    (30, 'Виноградная газировка', false, 0),
    (30, 'Юппи ананас со льдом', true, 7);

INSERT INTO product_types (product_id, type, available, amount)
VALUES
    (31, 'Малина клубника черная и красная смородина', false, 0),
    (31, 'Черника малина лимон', true, 8),
    (31, 'Вишня ананас', true, 9),
    (31, 'Мармеладные мишки с мандарином и лимоном', false, 0),
    (31, 'Манго гуава маракуйя', false, 0),
    (31, 'Жвачка клубника киви', true, 7),
    (31, 'Розовый лимонад', true, 10),
    (31, 'Маракуйя гуава апельсин', false, 0),
    (31, 'Виноград клубника', false, 0),
    (31, 'Черника смородина малина анис ментол', true, 5);

INSERT INTO product_types (product_id, type, available, amount)
VALUES
    (36, 'Лимонад виноград вишня', false, 0),
    (36, 'Кислые чернично-малиновые червячки', false, 0),
    (36, 'Кислый скитлс', false, 0),
    (36, 'Ягодная жвачка', false, 0),
    (36, 'Клубника арбуз', false, 0),
    (36, 'Дыня персик', false, 0),
    (36, 'Морс', true, 8),
    (36, 'Мятный бабл гам', false, 0),
    (36, 'Кислый ананас апельсин', false, 0),
    (36, 'Пинаколада', false, 0),
    (36, 'Спрайт', false, 0),
    (36, 'Кислый малиново-грейпфрутовый швепс', true, 7),
    (36, 'Барбарисовый лимонад', false, 0),
    (36, 'Киви маракуйя гуава', false, 0),
    (36, 'Гранатовый мармелад', true, 6),
    (36, 'Клубничный коктейль', false, 0),
    (36, 'Яблочный энергетик', false, 0),
    (36, 'Земляника виноград', false, 0),
    (36, 'Кислые вишневые червячки', false, 0),
    (36, 'Черничная фанта', false, 0),
    (36, 'Клубника ежевика', false, 0),
    (36, 'Клубничная фанта', false, 0),
    (36, 'Розовый лимонад', true, 10),
    (36, 'Манго драгонфрут', false, 0),
    (36, 'Клюква земляника', false, 0),
    (36, 'Тропический банан', true, 5),
    (36, 'Кислый лайм арбуз', false, 0),
    (36, 'Виноградный холс', false, 0),
    (36, 'Бузина маракуйя', false, 0),
    (36, 'Клюква лайм', false, 0),
    (36, 'Персик кактус', false, 0),
    (36, 'Грейпфрут черная смородина', false, 0),
    (36, 'Мятное мороженое', true, 9),
    (36, 'Молочный улун', false, 0),
    (36, 'Личи фейхоа', false, 0),
    (36, 'Манго арбуз', false, 0),
    (36, 'Роза личи', true, 7),
    (36, 'Кола вишня', false, 0),
    (36, 'Ягодный пунш', false, 0),
    (36, 'Красный апельсин', true, 6),
    (36, 'Малиновый мармелад', false, 0),
    (36, 'Маракуйя мандарин', true, 8),
    (36, 'Двойной манго', true, 9),
    (36, 'Черника молоко', false, 0),
    (36, 'Кокос дыня', false, 0),
    (36, 'Хвоя лесные ягоды', false, 0),
    (36, 'Алоэ виноград', false, 0),
    (36, 'Гуава ананас', false, 0),
    (36, 'Банан клубника', true, 10),
    (36, 'Айс латте', false, 0),
    (36, 'Арбузная жвачка', false, 0),
    (36, 'Черная смородина лимонад', false, 0),
    (36, 'Клубника киви', false, 0),
    (36, 'Ягодный энергетик', false, 0),
    (36, 'Смородина виноград', false, 0),
    (36, 'Яблоко киви', false, 0),
    (36, 'Малина ежевика', false, 0);

INSERT INTO product_types (product_id, type, available, amount)
VALUES
    (38, '0.4 omh', true, 8),
    (38, '0.6 omh', true, 6),
    (38, '0.8 omh', false, 0);

INSERT INTO product_types (product_id, type, available, amount)
VALUES
    (39, '0.4 omh', true, 7),
    (39, '0.7 omh', true, 6);

INSERT INTO product_types (product_id, type, available, amount)
VALUES
    (40, '0,3 Ом', false, 0),
    (40, '0,4 Ом', true, 6);

INSERT INTO product_types (product_id, type, available, amount)
VALUES
    (33, 'Мохито', false, 0),
    (33, 'Бабл Гам', false, 0),
    (33, 'Зеленый Чай', false, 0),
    (33, 'Малина Личи', false, 0),
    (33, 'Арбуз Малина', false, 0),
    (33, 'Манго Персик', false, 0),
    (33, 'Ягодный Микс', false, 0),
    (33, 'Алоэ Виноград', false, 0),
    (33, 'Арбузная Мята', false, 0),
    (33, 'Вишневый Фреш', false, 0),
    (33, 'Мятная Жвачка', true, 7),
    (33, 'Банан Карамель', false, 0),
    (33, 'Манго Маракуйя', false, 0),
    (33, 'Пунш Кокосовый', false, 0),
    (33, 'Ананас Клубника', false, 0),
    (33, 'Виноградный Лед', false, 0),
    (33, 'Мусс Клубничный', false, 0),
    (33, 'Арбузная Конфета', false, 0),
    (33, 'Грушевый Лимонад', false, 0),
    (33, 'Черничный Йогурт', false, 0),
    (33, 'Грейпберри Фьюжин', false, 0),
    (33, 'Смородина Черника', false, 0),
    (33, 'Виноград Малина Киви', false, 0),
    (33, 'Фруктовые Мармеладки', false, 0),
    (33, 'Грейпфрутовый Энергетик', false, 0);

INSERT INTO product_types (product_id, type, available, amount)
VALUES
    (42, 'Dr.papper', false, 0),
    (42, 'Апельсиновый фреш', false, 0),
    (42, 'Арбузный смузи', false, 0),
    (42, 'Бабл гам', false, 0),
    (42, 'Банан', false, 0),
    (42, 'Изумрудный виноград', false, 0),
    (42, 'Кислая вишня', false, 0),
    (42, 'Медовая дыня', false, 0),
    (42, 'Мята', false, 0),
    (42, 'Спрайт со льдом', false, 0),
    (42, 'Тройное яблоко', false, 0),
    (42, 'Тропические фрукты', false, 0);

-- Обрати внимание, у объекта с productName: 43 вместо productId. Исправлю на product_id = 43:
INSERT INTO product_types (product_id, type, available, amount)
VALUES
    (43, 'Яблоко', false, 0),
    (43, 'Вишня', false, 0),
    (43, 'Тутти фрути', false, 0),
    (43, 'Кола', false, 0),
    (43, 'Мята', false, 0);

INSERT INTO product_types (product_id, type, available, amount)
VALUES
    (34, 'Мятная жвачка', true, 8),
    (34, 'Клубника жвачка банан', false, 0),
    (34, 'Виноград изабелла алоэ', false, 0),
    (34, 'Клубнично вишневая конфета', false, 0),
    (34, 'Скитлс с виноградом изабелла', false, 0),
    (34, 'Манго сода виноград', false, 0),
    (34, 'Йогурт клубника маракуйя', false, 0),
    (34, 'Кислый малиновый скитлс', false, 0),
    (34, 'Вишня персик мята', false, 0),
    (34, 'Кислая фруктовая жвачка', false, 0),
    (34, 'Манго мамба апельсин', true, 7),
    (34, 'Чернично арбузная хубба-бубба', false, 0),
    (34, 'Имбирный лимонад с малиной', false, 0),
    (34, 'Черничный лимонад с малиной', false, 0),
    (34, 'Клубника виноград мята', false, 0),
    (34, 'Доктор пеппер со сладким апельсином', false, 0),
    (34, 'Чай с малиной и мятой', false, 0),
    (34, 'Лимонад черника лайм', false, 0),
    (34, 'Мамба кислое яблоко-киви', false, 0),
    (34, 'Клубнично арбузная хубба-бубба', false, 0),
    (34, 'Газировка маунтин дью с вишней', false, 0),
    (34, 'Арбузный пунш с малиной и клубникой', false, 0),
    (34, 'Энергетик с черникой', false, 0),
    (34, 'Лимонад ежевика сироп', false, 0),
    (34, 'Айрн брю с долькой апельсина', true, 7),
    (34, 'Ананасовый сироп с виноградом лёд', false, 0),
    (34, 'Виноград мята', false, 0),
    (34, 'Кислый виноградный чупа чупс', false, 0),
    (34, 'Кислые яблочные червячки', false, 0),
    (34, 'Кислый скитлс', false, 0),
    (34, 'Вишневые леденцы', false, 0),
    (34, 'Киви лёд кислинка', false, 0),
    (34, 'Кислые червячки с малиной и черешней', false, 0),
    (34, 'Клубника киви', false, 0),
    (34, 'Чернично клубничный фреш', false, 0),
    (34, 'Морозные лесные ягоды', false, 0),
    (34, 'Малина лед ежевика', false, 0),
    (34, 'Черника лед ежевика', false, 0),
    (34, 'Мятная вишня', false, 0);

INSERT INTO product_types (product_id, type, available, amount) VALUES
(41, 'Сопротивление: 0.3 Ом', false, 0),
(41, 'Сопротивление 0.2 Ом', true, 6);

INSERT INTO product_types (product_id, type, available, amount) VALUES
(27, 'Клюква Киви', false, 0),
(27, 'Манго Банан Ментол', false, 0),
(27, 'Лимон Маракуйя Лемонграсс', false, 0),
(27, 'Гуава Морошка', false, 0),
(27, 'Тархун Дыня Помело', false, 0),
(27, 'Ананас Лайм Земляника', false, 0),
(27, 'Грейпфрут Малина Виноград', false, 0),
(27, 'Крыжовник Барбарис', false, 0),
(27, 'Зеленая Мята Персик Кактус', false, 0),
(27, 'Зефир Кокос Черная Смородина', true, 7);

INSERT INTO product_types (product_id, type, available, amount) VALUES
(32, 'Киви-ананас', false, 0),
(32, 'Грейпфрут-гуава', true, 7),
(32, 'Мармеладные мишки-кола', true, 6),
(32, 'Манго-клубника', true, 6),
(32, 'Арбуз-маракуйя', true, 6),
(32, 'Черника-смородина', true, 7),
(32, 'Малина-ежевика', true, 6),
(32, 'Виноградный лимонад', true, 6),
(32, 'Яблоко-черешня', true, 6),
(32, 'Банан-маракуйя', true, 6);

INSERT INTO product_types (product_id, type, available, amount) VALUES
(37, 'Черника + Смородина', false, 0),
(37, 'Черника + Дыня', false, 0),
(37, 'Клюквенный Энергетик', false, 0),
(37, 'Виноградный Газировка', false, 0),
(37, 'Киви + Арбуз', false, 0),
(37, 'Лимон + Гранат + Малина', true, 7),
(37, 'Мандариновый Сорбет', true, 6),
(37, 'Ананс + Ежевика', false, 0),
(37, 'Земляника + Лайм', true, 6),
(37, 'Тик-Так Лимонная Мята', true, 6);

INSERT INTO product_types (product_id, type, available, amount) VALUES
(35, 'Кислые желатинки с маракуей и ананасом', true, 7),
(35, 'Кислый грейпфрут с вишней', true, 6),
(35, 'Кислые ленточки с маракуей и манго', true, 6),
(35, 'Кислые яблочно-лимонные колечки', true, 6),
(35, 'Кислое харибо с колой и черешней', false, 0),
(35, 'Кислый лимонад из арбуза лайма и Малины', false, 0),
(35, 'Кислый леденец с виноградом киви и яблоком', true, 6),
(35, 'Фанта апельсин с кислой малиной', true, 6),
(35, 'Кислая яблочно-клубничная шипучка', true, 6),
(35, 'Кислые дольки с персиком и клубникой', false, 0),
(35, 'Кислая Фанта с черникой', true, 6);

INSERT INTO product_types (product_id, type, available, amount) VALUES
(44, 'Фрутелла', false, 0),
(44, 'Кислый скитлс', false, 0),
(44, 'Малина смородина', false, 0),
(44, 'Клубничный коктейль', false, 0),
(44, 'Энергетик киви', false, 0),
(44, 'Ледяная мята', true, 7);

INSERT INTO product_types (product_id, type, available, amount) VALUES
(28, 'Кислое киви', false, 0),
(28, 'Кислое яблоко', false, 0),
(28, 'Кислая маракуя', false, 0),
(28, 'Кислый грейпфрут и чёрная смородина', true, 7),
(28, 'Кислый ананас малина', false, 0);
