import { CustomErrorType } from "../../interfaces";

export class CustomError extends Error {
  constructor(msg: string, public code: CustomErrorType) {
    super(msg)
  }
}