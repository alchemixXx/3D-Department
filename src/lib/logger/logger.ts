import pino from 'pino'
export class Logger {
  public getLogger() {
    const log = pino({
      prettyPrint: { colorize: true }
    })

    return log
  }
}