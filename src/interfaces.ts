import mongoose from 'mongoose';

export interface ICurrencyResponce {
  r030: number;
  txt: string;
  rate: number;
  cc: string;
  exchangedate: string;
}

export interface ICurrency {
  currencyId: number;
  name: string;
  rate: number;
  code: string;
}

export interface ISearchParams {
  [name: string]: string | number;
}


export interface IUser {
  tokens: IToken[];
  nickName: string;
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  role?: TRoles;
}

interface IToken {
  token: string
}


export enum TRoles {
  USER = 'User',
  ADMIN = 'Admin',
  DEVELOPER = 'Developer'
}

export interface IUserIdentity {
  user: IUserSchema;
  token: string;
}


export interface IUserSchema extends IUser, mongoose.Document {
  generateAuthToken: () => Promise<string>;

}

export interface IUserModel extends mongoose.Model<IUserSchema> {
  findByCredentials: (email: string, password: string) => Promise<IUserSchema>;
}


export interface ICurrencySchema extends ICurrency, mongoose.Document { }

export enum CustomErrorType {
  AUTH = 'AUTHENTIFICATION_ERROR',
}