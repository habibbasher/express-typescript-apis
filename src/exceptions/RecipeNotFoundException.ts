import HttpException from './HttpException';

class RecipeNotFoundException extends HttpException {
  constructor(id: string) {
    super(404, `Recipe with id ${id} not found`);
  }
}

export default RecipeNotFoundException;
