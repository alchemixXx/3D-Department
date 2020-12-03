import { IUser, TRoles } from "../../interfaces";
import { Logger } from "../logger/logger";

export class UserMapper {
  private readonly log = new Logger().getLogger()
  public createUser(params: IUser) {
    const dateNow = new Date();
    try {
      const userObj: IUser = {
        tokens: [],
        nickName: params.nickName,
        firstName: params.firstName,
        lastName: params.lastName,
        email: params.email,
        password: params.password,
        createdAt: dateNow,
        updatedAt: dateNow,
        role: TRoles.USER,
      }

      this.log.info({ userObj }, 'got User Object')

      return userObj;
    } catch (err) {
      throw err;
    }

  }
}