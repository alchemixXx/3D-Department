import express, { Router } from 'express';
import { CurrencyController } from '../controllers/currecy.controller';

export const currencyRouter: Router = new (express.Router as any)();

const controller = new CurrencyController()

currencyRouter.get('/currencies', controller.getAllCurrencies)
currencyRouter.get('/currencies/:id', controller.getCurrency)
