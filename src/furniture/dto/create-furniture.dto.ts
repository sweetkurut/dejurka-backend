import { IsString } from "class-validator";

export class CreateFurnitureDto {
  @IsString()
  name: string
}
