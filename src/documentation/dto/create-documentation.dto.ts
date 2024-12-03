import { IsString } from "class-validator";

export class CreateDocumentationDto {

  @IsString()
  name: string
}
