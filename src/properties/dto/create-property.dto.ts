import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  IsArray,
} from 'class-validator';
import { CornerType } from '../entities/property.entity';

export class CreatePropertyDto {
  @IsUUID() seriesId: string;
  @IsUUID() districtId: string;
  @IsUUID() renovationTypeId: string;
  @IsString() floor_type: string;
  @IsUUID() roomsCountId: string;
  @IsNumber() area_total: number;
  @IsEnum(CornerType) @IsOptional() corner_type?: CornerType;
  @IsArray() @IsOptional() documentsIds?: string[];
  @IsUUID() heatingTypeId: string;
  @IsUUID() furnitureId: string;
  @IsString() address: string;
  @IsString() @IsOptional() description?: string;
  @IsNumber() price_visible: number;
  @IsNumber() price_hidden: number;
  @IsArray() @IsOptional() photos?: string[];
  @IsString() @IsOptional() construction_company?: string;
  @IsString() @IsOptional() housing_complex?: string;
}
