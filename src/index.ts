import { app } from './app'
import { Logger } from './lib/logger/logger';
import config from 'config'

const log = new Logger().getLogger()

const PORT = process.env.PORT || config.get<number>('ports.server');

app.listen(PORT, () => {
  log.info(`Server is runninng on port ${PORT}`)
});
