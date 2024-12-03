import { IsInt, IsString } from "class-validator";

export class CreateRepairDto {
  @IsString()
  name: string

  @IsInt()
  realEstateId: number;
}
