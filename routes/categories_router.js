const { Router } = require('express');
const CategoriesController = require('../controllers/categories.controller.js');
const categoriesRouter = new Router();

categoriesRouter.post('/category', CategoriesController.createCategory);
categoriesRouter.get('/category', CategoriesController.getAllCategory);
categoriesRouter.delete('/category', CategoriesController.deleteCategory);

module.exports = categoriesRouter;