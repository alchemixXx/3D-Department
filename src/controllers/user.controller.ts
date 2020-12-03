import { CustomErrorType } from "../interfaces";
import { CustomError } from "../lib/errors/custom-error";
import { UserMapper } from "../lib/mappers/user.mapper";
import { User } from "../models/user.model";
import { AuthenticateService } from "../services/authenticate.service";

export class UserController {
  public async createUser(req: any, res: any) {
    const userMapper = new UserMapper();
    try {
      const userObj = userMapper.createUser(req.body)
      const user = new User({ ...userObj });

      await user.save();
      const token = await user.generateAuthToken();
      res.status(201).send({ user, token });
    } catch (error) {
      if (error instanceof CustomError && error.code === CustomErrorType.AUTH) {
        res.status(403).send({ msg: 'Can not login to service', error: error.message });
        return;
      };

      res.status(400).send({ error: error.message });
    }
  }

  public async login(req: any, res: any) {
    try {
      const user = await User.findByCredentials(req.body.email, req.body.password);
      const token = await user.generateAuthToken();
      res.send({ user, token });
    } catch (error) {
      if (error instanceof CustomError && error.code === CustomErrorType.AUTH) {
        res.status(403).send({ msg: 'Can not login to service', error: error.message });
        return;
      };

      res.status(400).send({ error: error.message });
    }
  }

  public async logout(req: any, res: any) {
    const authenticator = new AuthenticateService()
    try {
      const user = await authenticator.authenticate(req.headers['authorization'])
      await authenticator.logout(user)

      res.send({ msg: 'You are logged out' });
    } catch (error) {
      if (error instanceof CustomError && error.code === CustomErrorType.AUTH) {
        res.status(403).send({ msg: 'Can not perform authentication', error: error.message });
        return;
      };

      res.status(500).send({ msg: 'Something went wrong', error: error.message });
    }
  }

  public async getUserInfo(req: any, res: any) {
    const authenticator = new AuthenticateService()
    try {
      const { user } = await authenticator.authenticate(req.headers['authorization'])

      if (!user) {
        throw new Error('No user in DB')
      }

      res.send(user);
    } catch (error) {
      if (error instanceof CustomError && error.code === CustomErrorType.AUTH) {
        res.status(403).send({ msg: 'Can not login to service', error: error.message });
        return;
      };

      res.send({ msg: 'No user in DB', error: error.message })
    }
  }


  public async deleteUser(req: any, res: any) {
    const authenticator = new AuthenticateService()
    try {
      const { user } = await authenticator.authenticate(req.headers['authorization'])
      await user.remove();
      res.send(user);
    } catch (error) {
      if (error instanceof CustomError && error.code === CustomErrorType.AUTH) {
        res.status(403).send({ msg: 'Can not login to service', error: error.message });
        return;
      };

      res.status(500).send({ error: error.message });
    }
  }
}