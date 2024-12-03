import { IsString } from "class-validator";

export class CreateHeatingDto {

  @IsString()
  name: string;
}
