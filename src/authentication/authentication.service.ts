import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserWithThatEmailAlreadyExistsException from '../exceptions/UserWithThatEmailAlreadyExistsException';
import IInfoStoredInToken from '../interfaces/infoStoredInToken';
import IToken from '../interfaces/token.interface';
import CreateUserDto from '../user/user.dto';
import IUser from '../user/user.interface';
import userModel from './../user/user.model';

class AuthenticationService {
  public user = userModel;

  public async register(userInfo: CreateUserDto) {
    if (await this.user.findOne({ email: userInfo.email })) {
      throw new UserWithThatEmailAlreadyExistsException(userInfo.email);
    }

    const hashedPassword = await bcrypt.hash(userInfo.password, 10);
    const user = await this.user.create({
      ...userInfo,
      password: hashedPassword
    });

    const token = this.createToken(user);
    const cookie = this.createCookie(token);

    return {
      cookie,
      user
    };
  }

  public createCookie(token: IToken) {
    return `Authorization=${token.token}; HttpOnly; Max-Age=${token.expiresIn}`;
  }

  public createToken(user: IUser): IToken {
    const expiresIn = 60 * 60; // an hour
    const secret = process.env.JWT_SECRET || '';
    const infoStoredInToken: IInfoStoredInToken = {
      _id: user._id
    };

    return {
      expiresIn,
      token: jwt.sign(infoStoredInToken, secret, { expiresIn })
    };
  }
}

export default AuthenticationService;
