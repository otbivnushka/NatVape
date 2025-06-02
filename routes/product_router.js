const { Router } = require('express');
const ProductController = require('../controllers/product.controller.js');
const productRouter = new Router();

productRouter.post('/product', ProductController.createProduct);
productRouter.get('/product/:id', ProductController.getProduct);
productRouter.get('/product', ProductController.getAllProduct);
productRouter.put('/product', ProductController.updateProduct);
productRouter.delete('/product', ProductController.deleteProduct);
productRouter.delete('/product/:id', ProductController.deleteProductType);

module.exports = productRouter;