import { Logger } from "./lib/logger/logger";
import { CurrencyParser } from "./lib/parsers/curency.parser";
import './db/mongoose'

const log = new Logger().getLogger()
const parser = new CurrencyParser()

parser.processCurrencies().then(() => {
  log.info('All currencies have been processed');
  process.exit(0)
}).catch(err => {
  log.error({ err })
  process.exit(1)
})
