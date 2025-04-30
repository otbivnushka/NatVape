const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const TelegramBot = require('node-telegram-bot-api');

// === Настройки ===
const PORT = 3000;
const token = '7864852032:AAGuul8DMOybs9JrROLTY8iIFZpc-Y78QNI';
const WEBAPP_URL = `http://localhost:${PORT}/webapp`; // Поменяй при деплое

// === Telegram Bot ===
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  const keyboard = {
    keyboard: [
      [
        {
          text: '🛍 Открыть магазин',
          web_app: { url: WEBAPP_URL }
        }
      ]
    ],
    resize_keyboard: true
  };

  bot.sendMessage(chatId, 'Нажми кнопку ниже!', {
    reply_markup: keyboard
  });
});

bot.on('message', (msg) => {
  if (msg.web_app_data) {
    bot.sendMessage(msg.chat.id, `Получено из WebApp: ${msg.web_app_data.data}`);
  }
});

// === Express Backend ===
const app = express();

app.use(cors());
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/webapp', express.static(path.join(__dirname, 'public'))); // Фронт в папке "public"

const db = new sqlite3.Database('./data.sqlite');

app.get('/api/products', (req, res) => {
  const category = req.query.category || '';
  db.all('SELECT * FROM products WHERE category = ?', [category], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    const updatedRows = rows.map(row => ({
      ...row,
      image: `http://localhost:${PORT}/${row.image}`
    }));

    res.json(updatedRows);
  });
});

// === Запуск сервера ===
app.listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`);
});

