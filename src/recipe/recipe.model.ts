import mongoose from 'mongoose';
import IRecipe from './recipe.interface';

const recipeSchema = new mongoose.Schema({
  name: String,
  description: String,
  imagePath: String,
  ingredients: Array
});

const recipeModel = mongoose.model<IRecipe & mongoose.Document>(
  'Recipe',
  recipeSchema
);

export default recipeModel;
