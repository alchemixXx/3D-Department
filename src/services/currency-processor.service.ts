import { ICurrency, ICurrencySchema, ISearchParams } from '../interfaces';
import mongoose from 'mongoose';
import { Logger } from '../lib/logger/logger';
import { Currency } from '../models/currency.model';

export class CurrencyProcessorService {
  protected inctances: mongoose.Document[] = [];
  private failed: PromiseRejectedResult[] = [];
  private log = new Logger().getLogger()

  public async addCurrency(item: ICurrency) {
    try {
      this.inctances.push(new Currency(item))
      if (this.inctances.length >= 100) {
        this.log.info('saving records to db')
        await this.save()
        this.inctances.length = 0;
      }
    } catch (err) {
      this.log.error(err)
      throw err;
    }
  }

  public async save() {
    try {
      const results = await Promise.allSettled(this.inctances.map(el => el.save()))
      results.forEach(data => {

        if (data.status === 'rejected') {
          this.failed.push(data)
        }

      })
      this.log.info(`saved ${this.inctances.length} records`)
    } catch (err) {
      this.log.error('error during saving to db', err)
      throw err;
    }
  }

  public async getItem(searchParams: ISearchParams) {
    const instance = await Currency.findOne(searchParams)

    return instance;
  }

  public async updateCurrency(currency: ICurrency, document: mongoose.Document) {
    const cur = document as ICurrencySchema;
    cur.code = currency.code
    cur.rate = currency.rate

    await document.save()
  }

  public async getFailedCourses() {
    if (this.failed.length > 0) {
      this.log.warn(this.failed)
    }
  }

}