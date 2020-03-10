import { Router, Response, NextFunction } from 'express';
import NotAuthorizedException from '../exceptions/NotAuthorizedException';
import IController from '../interfaces/controller.interface';
import IRequestWithUser from '../interfaces/requestWithUser.interface';
import authMiddleware from '../middlewares/auth.middleware';
import postModel from '../post/post.model';

class UserController implements IController {
  public path = '/users';
  public router = Router();
  private post = postModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}/:id/posts`,
      authMiddleware,
      this.getAllPostsOfUser
    );
  }

  private getAllPostsOfUser = async (
    request: IRequestWithUser,
    response: Response,
    next: NextFunction
  ) => {
    const userId = request.params.id;
    if (userId === request.user._id.toString()) {
      const posts = await this.post.find({ author: userId });
      response.send(posts);
    }
    next(new NotAuthorizedException());
  };
}

export default UserController;
