import requestPromise from 'request-promise';
import { ICurrencyResponce } from '../../interfaces';
import { CURRENCY_LIST_URL } from '../../constants';
import { Logger } from '../logger/logger';
import { CurrencyMapper } from '../mappers/currency.mapper';
import { CurrencyProcessorService } from '../../services/currency-processor.service';



export class CurrencyParser {
  private log = new Logger().getLogger()
  private currencyMapper: CurrencyMapper = new CurrencyMapper();
  private readonly processingService: CurrencyProcessorService = new CurrencyProcessorService()


  public async processCurrencies() {
    try {
      const urlToSend = CURRENCY_LIST_URL;
      const jsonResp = await requestPromise(urlToSend);
      const resp: ICurrencyResponce[] = JSON.parse(jsonResp);
      for (const obj of resp) {
        try {
          const currencyObj = this.currencyMapper.map(obj)
          const dbItem = await this.processingService.getItem({ 'currencyId': currencyObj.currencyId })
          if (dbItem) {
            this.log.info(`item ${currencyObj.code} already in database. Updating`)
            this.processingService.updateCurrency(currencyObj, dbItem)
          } else {
            this.log.info(`Adding item ${currencyObj.code}: ${currencyObj.name}`)
            this.processingService.addCurrency(currencyObj);
          }

        } catch (err) {
          console.error(err)
          throw err
        }
      }

      await this.processingService.save()
      this.processingService.getFailedCourses()


      this.log.info(`parsing ${CURRENCY_LIST_URL} is done`)
    } catch (err) {
      console.error(err);
    }
  }

}
