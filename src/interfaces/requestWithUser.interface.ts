import { Request } from 'express';
import IUser from '../user/user.interface';

interface IRequestWithUser extends Request {
  user: IUser;
}

export default IRequestWithUser;
