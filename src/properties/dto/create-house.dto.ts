import {
  IsString,
  IsNumber,
  IsOptional,
  IsUUID,
  IsArray,
} from 'class-validator';

export class CreateHouseDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  price_visible: number;

  @IsOptional()
  @IsNumber()
  price_hidden?: number; // только admin

  @IsString()
  owner_phone: string;

  @IsOptional()
  @IsArray()
  photos?: string[];

  @IsUUID()
  districtId: string;

  @IsUUID()
  documentTypeId: string;

  // 🏠 дом
  @IsNumber()
  house_area: number;

  @IsNumber()
  land_area: number;

  @IsOptional()
  @IsString()
  communications?: string;
}
