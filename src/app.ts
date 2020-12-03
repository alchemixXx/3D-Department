import express from 'express';

import './db/mongoose'
import pino from 'pino-http'
import { userRouter } from './routers/user.route';
import { currencyRouter } from './routers/currency.route';

export const app = express();

const logger = pino({
  prettyPrint: true
})

app.use(express.json());
app.use(logger);
app.use(currencyRouter);
app.use(userRouter);
