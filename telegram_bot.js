require('dotenv').config();
const pool = require('./db');
const { Telegraf, Markup } = require('telegraf');
const { message } = require('telegraf/filters');

const token = process.env.TELEGRAM_BOT_TOKEN;
const WEBAPP_URL = "https://www.youtube.com/";

const bot = new Telegraf(token);

const authorizedUsers = new Set();
const userState = new Map();

let result_categories;
let result_products;

bot.start((ctx) => {
    const username = ctx.from.username || 'пользователь';
    ctx.reply(`Привет, @${username}!\nДля того чтобы сделать заказ запусти приложение`, 
        Markup.keyboard([
            [Markup.button.webApp('Открыть приложение', WEBAPP_URL)]
        ]).resize()
    );
});

bot.hears('/auth', (ctx) => {
    if (ctx.from.username === 'chinathez') {
        authorizedUsers.add(ctx.from.id);
        ctx.reply('Дарова заебал', Markup.keyboard([
            ['Ассортимент'],
            ['Заказы']
        ]).resize());
    } else {
        ctx.reply('Ты не авторизован.');
    }
});

bot.hears('Ассортимент', async ctx => {
    if (!authorizedUsers.has(ctx.from.id)) {
        return ctx.reply('Нет доступа. Введите /auth');
    }
    result_categories = (await pool.query('SELECT * FROM categories')).rows;
    const categoryButtons = result_categories.map(item => [item.name]);
    userState.set(ctx.from.id, { step: 'choose_category' });

    ctx.reply('Выберите категорию:', Markup.keyboard(categoryButtons).resize());
});

bot.hears('Заказы', ctx => {
    ctx.reply('Показаны заказы');
});

bot.on(message('text'), async (ctx) => {
    const state = userState.get(ctx.from.id);
    if (state?.step === 'choose_category') {
        const selectedCategory = ctx.message.text;
        selectedCategoryObject = result_categories.find(category => category.name == selectedCategory);
        result_products = (await pool.query('SELECT * FROM products WHERE category_id = $1', [selectedCategoryObject.id])).rows;
        const productsButtons = result_products.map(item => [item.name]);
        userState.set(ctx.from.id, { step: 'choose_product', category: selectedCategory });

        ctx.reply(
            `Товары из категории "${selectedCategory}"`,
            Markup.keyboard(productsButtons).resize()
        );
    }

    if (state?.step === 'choose_product') {
        const selectedProduct = ctx.message.text;
        console.log(selectedProduct);
        selectedProductObject = result_products.find(product => product.name == selectedProduct);
        const result_types = (await pool.query('SELECT * FROM product_types WHERE product_id = $1', [selectedProductObject.id])).rows;
        const productsButtons = result_types.map(item => [item.type]);
        userState.set(ctx.from.id, { step: 'edit_types', product: selectedProduct });

        ctx.reply(
            `Типы товара "${selectedProduct}"`,
            Markup.keyboard(productsButtons).resize()
        );
    }

    else if (ctx.message.text === '⬅ Назад') {
        ctx.reply('Главное меню', Markup.keyboard([
            ['Ассортимент'],
            ['Заказы']
        ]).resize());
        userState.delete(ctx.from.id);
    }
});

bot.launch().then(() => console.log('Бот запущен'));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
