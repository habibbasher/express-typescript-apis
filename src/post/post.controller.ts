import { Router, Request, Response, NextFunction } from 'express';
import PostNotFoundException from '../exceptions/PostNotFoundException';
import IController from '../interfaces/controller.interface';
import IRequestWithUser from '../interfaces/requestWithUser.interface';
import authMiddleware from '../middlewares/auth.middleware';
import validationMiddleware from '../middlewares/validation.middleware';
import CreatePostDto from './post.dto';
import IPost from './post.interface';
import postModel from './post.model';

class PostController implements IController {
  public path = '/posts';
  public router = Router();
  private post = postModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.getAllPosts);
    this.router.get(`${this.path}/:id`, this.getPostById);
    this.router
      .all(`${this.path}/*`, authMiddleware)
      .patch(
        `${this.path}/:id`,
        validationMiddleware(CreatePostDto, true),
        this.modifyPost
      )
      .delete(`${this.path}/:id`, this.deletePost)
      .post(
        this.path,
        authMiddleware,
        validationMiddleware(CreatePostDto),
        this.createPost
      );
  }

  private getAllPosts = async (request: Request, response: Response) => {
    const posts = await this.post.find().populate('author', '-password');
    response.send(posts);
  };

  private getPostById = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const id = request.params.id;
    const post = await this.post.findById(id);
    if (post) {
      response.send(post);
    } else {
      next(new PostNotFoundException(id));
    }
  };

  private modifyPost = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const id = request.params.id;
    const postData: IPost = request.body;
    const post = await this.post.findByIdAndUpdate(id, postData, { new: true });
    if (post) {
      response.send(post);
    } else {
      next(new PostNotFoundException(id));
    }
  };

  private createPost = async (
    request: IRequestWithUser,
    response: Response
  ) => {
    const postData: CreatePostDto = request.body;
    const createdPost = new this.post({
      ...postData,
      authorId: request.user._id
    });
    const savedPost = await createdPost.save();
    await savedPost.populate('author', '-password').execPopulate();
    response.send(savedPost);
  };

  private deletePost = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const id = request.params.id;
    const successResponse = await this.post.findByIdAndDelete(id);
    if (successResponse) {
      response.send(200);
    } else {
      next(new PostNotFoundException(id));
    }
  };
}

export default PostController;
