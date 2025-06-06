require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const productRouter = require('./routes/product_router.js');
const categoriesRouter = require('./routes/categories_router.js');
const cartRouter = require('./routes/cart_router.js');

const PORT = 3000;

// === Express Backend ===

const app = express();

app.use(cors());
app.use(express.json({ encoding: 'utf-8' }));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('', express.static(path.join(__dirname, 'public')));
app.use('/api', productRouter);
app.use('/api', categoriesRouter);
app.use('/api', cartRouter);

app.listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`);
});