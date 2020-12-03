import { ICurrency, ICurrencyResponce } from "../../interfaces";

export class CurrencyMapper {
  public map(currency: ICurrencyResponce): ICurrency {
    return {
      currencyId: currency.r030,
      name: currency.txt,
      code: currency.cc,
      rate: currency.rate
    };
  }
}

