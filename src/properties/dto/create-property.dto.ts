import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CornerType } from '../entities/property.entity';

export class CreatePropertyDto {
  @IsUUID()
  seriesId: string;

  @IsUUID()
  districtId: string;

  @IsUUID()
  renovationTypeId: string;

  @IsUUID()
  roomsCountId: string;

  @IsUUID()
  heatingTypeId: string;

  // ⬅️ НЕОБЯЗАТЕЛЬНО
  @IsOptional()
  @IsUUID()
  furnitureId?: string;

  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  documentsIds?: string[];

  @Type(() => Number)
  @IsNumber()
  area_total: number;

  @IsString()
  floor_type: string;

  @IsOptional()
  @IsEnum(CornerType)
  corner_type?: CornerType;

  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  description?: string;

  @Type(() => Number)
  @IsNumber()
  price_visible: number;

  // ⬅️ admin only
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  price_hidden?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  photos?: string[];
}
