import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import WrongCredentialsException from '../exceptions/WrongCredentialsException';
import IController from '../interfaces/controller.interface';
// import jwt from 'jsonwebtoken';
// import IInfoStoredInToken from '../interfaces/infoStoredInToken';
// import IToken from '../interfaces/token.interface';
// import IUser from '../user/user.interface';
import validationMiddleware from '../middlewares/validation.middleware';
import CreateUserDto from '../user/user.dto';
import userModel from './../user/user.model';
import AuthenticationService from './authentication.service';
import LogInDto from './logIn.dto';

class AuthenticationController implements IController {
  public path = '/auth';
  public router = Router();
  public authenticationService = new AuthenticationService();
  private user = userModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/register`,
      validationMiddleware(CreateUserDto),
      this.registration
    );
    this.router.post(
      `${this.path}/login`,
      validationMiddleware(LogInDto),
      this.loggingIn
    );
    this.router.post(`${this.path}/logout`, this.loggingOut);
  }

  private registration = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const userInfo: CreateUserDto = request.body;
    try {
      const { cookie, user } = await this.authenticationService.register(
        userInfo
      );
      response.setHeader('Set-Cookie', [cookie]);
      // const res = {
      //   user: user,
      //   token: token.token
      // };
      response.status(201).send(user);
    } catch (error) {
      next(error);
    }
  };

  private loggingIn = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const logInInfo: LogInDto = request.body;
    const user = await this.user.findOne({ email: logInInfo.email });
    if (user) {
      const isPasswordMatching = await bcrypt.compare(
        logInInfo.password,
        user.password
      );
      if (isPasswordMatching) {
        const token = this.authenticationService.createToken(user);
        response.setHeader('Set-Cookie', [
          this.authenticationService.createCookie(token)
        ]);
        const res = {
          user: user,
          token: token.token,
          expiresIn: token.expiresIn
        };
        response.status(200).send(res);
      } else {
        next(new WrongCredentialsException());
      }
    } else {
      next(new WrongCredentialsException());
    }
  };

  private loggingOut = (request: Request, response: Response) => {
    response.setHeader('Set-Cookie', ['Authorization=;Max-age=0']);
    response.sendStatus(200);
  };

  // private createCookie(token: IToken) {
  //   return `Authorization=${token.token}; HttpOnly; Max-Age=${token.expiresIn}`;
  // }

  // private createToken(user: IUser): IToken {
  //   const expiresIn = 60 * 60; // an hour
  //   const secret = process.env.JWT_SECRET || '';
  //   const infoStoredInToken: IInfoStoredInToken = {
  //     _id: user._id
  //   };
  //   return {
  //     expiresIn,
  //     token: jwt.sign(infoStoredInToken, secret, { expiresIn })
  //   };
  // }
}

export default AuthenticationController;
