import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import config from 'config';
import { CustomErrorType, IUserIdentity } from '../interfaces';
import { CustomError } from '../lib/errors/custom-error';

const jwsSecret = process.env.JWT_SECRET_PHRASE || config.get<string>('secret.secretPhrase');

export class AuthenticateService {
  public async authenticate(reqToken: string | string[] | undefined) {
    if (!this.isToken(reqToken)) {
      throw new CustomError(`Can not find appropriate token in headers, got: ${reqToken}`, CustomErrorType.AUTH)
    }

    const token = reqToken.replace('Bearer ', '');
    const decoded = jwt.verify(token, jwsSecret);

    if (typeof decoded === 'string') {
      throw new CustomError("Unparsedble token", CustomErrorType.AUTH)
    }

    const user = await User.findOne({ _id: (decoded as any)._id, 'tokens.token': token })

    if (!user) {
      throw new CustomError("Can not find user in database", CustomErrorType.AUTH)
    }

    return { token, user }
  }

  public async logout(identity: IUserIdentity) {
    const { token, user } = identity;

    user.tokens = user.tokens.filter(existingToken => {
      return existingToken.token !== token;
    });

    await user.save();
  }

  public async logoutAll(identity: IUserIdentity) {
    const { user } = identity;

    user.tokens = [];
    await user.save();
  }

  private isToken(reqToken: string | string[] | undefined): reqToken is string {
    return typeof reqToken === 'string'
  }
}

