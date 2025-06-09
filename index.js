const app = require('./server');
const bot = require('./telegram_bot');

bot.launch().then(() => console.log('Бот запущен'));
const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Сервер запущен: http://localhost:${PORT}`);
  });