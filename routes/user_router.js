const { Router } = require('express');
const UserController = require('../controllers/user.controller.js');
const userRouter = new Router();

userRouter.post('/user', UserController.createUser);
userRouter.get('/user/:login', UserController.getUser);
userRouter.get('/user/getcarts/:id', UserController.getAllCarts);
userRouter.put('/user/makeadmin/:id', UserController.makeAdmin);
userRouter.put('/user/unmakeadmin/:id', UserController.removeAdmin);


module.exports = userRouter;