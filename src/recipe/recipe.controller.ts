import { Router, Request, Response, NextFunction } from 'express';
import RecipeNotFoundException from '../exceptions/RecipeNotFoundException';
import IController from '../interfaces/controller.interface';
import IRequestWithUser from '../interfaces/requestWithUser.interface';
import authMiddleware from '../middlewares/auth.middleware';
import validationMiddleware from '../middlewares/validation.middleware';
import CreateRecipeDto from './recipe.dto';
import IRecipe from './recipe.interface';
import recipeModel from './recipe.model';

class RecipeController implements IController {
  public path = '/recipes';
  public router = Router();
  private recipe = recipeModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.getRecipes);
    this.router.put(
      this.path,
      // validationMiddleware(CreateRecipeDto, true),
      this.modifyRecipe
    );
  }

  private getRecipes = async (request: Request, response: Response) => {
    const recipes = await this.recipe.find();
    response.send(recipes);
  };

  private processRecipes = async (recipes: IRecipe[]) => {
    const totalResponse: IRecipe[] = [];
    for (const recipe of recipes) {
      let singleResponse: IRecipe = null;
      if (recipe._id) {
        singleResponse = await this.recipe.findByIdAndUpdate(
          recipe._id,
          recipe,
          { new: true }
        );
      } else {
        const newRecipe = new this.recipe(recipe);
        singleResponse = await newRecipe.save();
      }
      // add some code here to process the response.
      totalResponse.push(singleResponse);
    }
    return totalResponse;
  };

  private modifyRecipe = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const modifiedRecipe: IRecipe[] = request.body;
    const recipes = await this.processRecipes(modifiedRecipe);
    response.send(recipes);
    // console.log('TCL: RecipeController -> recipes', recipes);
    // if (recipes) {
    //   response.send(recipes);
    // }
    // else {
    //   // next(new RecipeNotFoundException(id));
    // }
  };
}

export default RecipeController;
