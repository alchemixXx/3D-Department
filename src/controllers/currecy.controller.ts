import { CustomErrorType } from "../interfaces";
import { CustomError } from "../lib/errors/custom-error";
import { Currency } from "../models/currency.model";
import { AuthenticateService } from "../services/authenticate.service";
import { isValidLimit, isValidPage } from "../utils";

export class CurrencyController {
  public async getAllCurrencies(req: any, res: any) {
    try {
      const authentificator = new AuthenticateService()
      const { user } = await authentificator.authenticate(req.headers['authorization'])

      if (!user) {
        res.status(403).send({ msg: 'Please, login to use the service' });
        return;
      }

      const queryPage = req.query.page as string
      const queryLimit = req.query.limit as string
      const page = isValidPage(queryPage) ? Number(queryPage) : 1
      const limit = isValidLimit(queryLimit) ? Number(queryLimit) : 5

      const documents = await Currency.find()
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

      const count = await Currency.countDocuments();

      res.json({
        params: {
          totalPages: Math.ceil(count / limit),
          currentPage: page
        },
        currencies: documents,
      });
    } catch (error) {
      if (error instanceof CustomError && error.code === CustomErrorType.AUTH) {
        res.status(403).send({ msg: 'Can not login to service', error: error.message });
        return;
      };

      res.status(500).send({ error: error.message })
    }
  }


  public async getCurrency(req: any, res: any) {
    try {
      const authentificator = new AuthenticateService()
      const { user } = await authentificator.authenticate(req.headers['authorization'])

      if (!user) {
        res.status(403).send({ msg: 'Please, login to use the service' });
        return;
      }

      const id = req.params.id as string
      const document = await Currency.findOne({ currencyId: Number(id) })

      if (!document) {
        res.status(404).send({ msg: `Requested id ${id} is missing in database` });
        return;
      }

      res.json(document)

    } catch (error) {
      if (error instanceof CustomError && error.code === CustomErrorType.AUTH) {
        res.status(403).send({ msg: 'Can not login to service', error: error.message });
        return;
      };

      res.status(500).send({ error: error.message })
    }
  }
}