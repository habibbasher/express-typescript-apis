import { IsString, IsArray } from 'class-validator';

class CreateRecipeDto {
  @IsString()
  public name: string;

  @IsString()
  public description: string;

  @IsString()
  public imagePath: string;
}

export default CreateRecipeDto;
