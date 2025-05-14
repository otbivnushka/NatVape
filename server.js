const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');
const TelegramBot = require('node-telegram-bot-api');

// === Настройки ===
const PORT = 3000;
const token = '7864852032:AAGuul8DMOybs9JrROLTY8iIFZpc-Y78QNI';
// const WEBAPP_URL = `https://localhost:${PORT}/webapp`; // Поменяй при деплое
const WEBAPP_URL = `https://natvape-production.up.railway.app/webapp/`;

// === Telegram Bot ===
const bot = new TelegramBot(token, { polling: true });

bot.on('message', (msg) => {
  console.log(msg);
  if (msg.text === '/start')
  {
    
    const keyboard = {
      keyboard: [
        [
          {
            text: 'Открыть приложение',
            web_app: { url: WEBAPP_URL }
          }
        ]
      ],
      resize_keyboard: true
    };
    bot.sendMessage(msg.chat.id, `Привет, @${msg.from.username}!\nДля того чтобы сделать заказ запусти приложение`, {
      reply_markup: keyboard
    });
  }
  else
  {
    bot.sendMessage(msg.chat.id, 'Не понимаю тебя');
  }
});

// === Express Backend ===

const app = express();

// const pool = new Pool({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'db',
//   password: '2342',
//   port: 5432,
// });

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:SVuibunbRcVuOohBEaILfxluWLLUnwQg@ballast.proxy.rlwy.net:16389/railway';

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

app.use(cors());
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/webapp', express.static(path.join(__dirname, 'public')));

app.get('/api/products', (req, res) => {
  const category = req.query.category || '';
  pool.query('SELECT * FROM products WHERE category = $1', [category], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    console.log(result.rows);
    const updatedRows = result.rows.map(row => ({
      ...row,
      image: `https://natvape-production.up.railway.app/${row.image}`
    }));

    res.json(updatedRows);
  });
});

app.get('/api/products', (req, res) => {
  const category = req.query.category || '';
  pool.query('SELECT * FROM products WHERE category = $1', [category], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    const updatedRows = result.rows.map(row => ({
      ...row,
      image: `https://natvape-production.up.railway.app/${row.image}`
    }));

    res.json(updatedRows);
  });
});

app.get('/api/product-types', (req, res) => {
  const id = req.query.id || '';
  pool.query('SELECT * FROM product_types WHERE product_id = $1', [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(result.rows);
  });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`);
});
