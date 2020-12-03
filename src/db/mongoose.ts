import mongoose from 'mongoose';
import confrig from 'config';
import { Logger } from '../lib/logger/logger';

const log = new Logger().getLogger()

const connectionUrl = process.env.DB_CONNECTION_URL || confrig.get<string>('db.url');

export const db = mongoose.connect(connectionUrl, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

db.then(() => log.info('Connected to db')).catch(err => log.error(err))