import mongoose from 'mongoose'
import { ICurrencySchema } from '../interfaces'

export const currencySchema = new mongoose.Schema({
  currencyId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  rate: {
    type: Number,
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
},
)

currencySchema.methods.toJSON = function () {
  const currency = this;

  const currencyObject = currency.toObject();

  delete currencyObject._id;
  delete currencyObject.__v;

  return currencyObject;
};

export const Currency = mongoose.model<ICurrencySchema>('Currency', currencySchema)
