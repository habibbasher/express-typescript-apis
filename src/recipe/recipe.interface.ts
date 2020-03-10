interface IIngredient {
  name: string;
  amount: number;
}

interface IRecipe {
  _id: string;
  name: string;
  description: string;
  imagePath: string;
  ingredients: IIngredient[];
}

export default IRecipe;
