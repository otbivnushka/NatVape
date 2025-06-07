const { Router } = require('express');
const CartController = require('../controllers/cart.controller.js');
const cartRouter = new Router();

cartRouter.post('/cart', CartController.createCart);
cartRouter.get('/cart/:id', CartController.getCart);
cartRouter.put('/cart/add', CartController.addToCart);
cartRouter.put('/cart/delete', CartController.deleteFromCart);
cartRouter.put('/cart/send', CartController.sendCart);
cartRouter.delete('/cart', CartController.deleteCart);

module.exports = cartRouter;