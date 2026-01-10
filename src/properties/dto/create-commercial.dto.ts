import {
  IsString,
  IsNumber,
  IsOptional,
  IsUUID,
  IsArray,
} from 'class-validator';

export class CreateCommercialDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  price_visible: number;

  @IsOptional()
  @IsNumber()
  price_hidden?: number; // only admin

  @IsString()
  owner_phone: string;

  @IsOptional()
  @IsArray()
  photos?: string[];

  @IsUUID()
  districtId: string;

  @IsUUID()
  documentTypeId: string;

  @IsNumber()
  total_area: number;

  @IsNumber()
  floors: number;

  @IsOptional()
  @IsString()
  communications?: string;
}
