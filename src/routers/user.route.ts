import express, { Router } from 'express';
import { UserController } from '../controllers/user.controller';

export const userRouter: Router = new (express.Router as any)();

const controller = new UserController()

userRouter.post('/users', controller.createUser)
userRouter.post('/users/login', controller.login)
userRouter.post('/users/logout', controller.logout)
userRouter.get('/users/me', controller.getUserInfo)
userRouter.delete('/users/me', controller.deleteUser)









