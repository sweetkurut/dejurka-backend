// src/real-estate/dto/create-real-estate.dto.ts
import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsArray,
  IsNotEmpty,
} from 'class-validator';
import { Column } from 'typeorm';

export class CreateRealEstateDto {
  // ()

  imagePath?: string;

  @IsOptional()
  @IsString()
  imageBase64?: string;



  @IsNumber()
  seriesId: number;

  @IsOptional()
  @IsString()
  buildingCompanyName?: string;

  @IsOptional()
  @IsString()
  residentialComplexName?: string;

  @IsOptional()
  @IsString()
  section?: string;

  @IsOptional()
  @IsBoolean()
  corner?: boolean;

  @IsOptional()
  @IsString()
  renovation?: string;

  @IsOptional()
  @IsString()
  district?: string;

  @IsString()
  @IsNotEmpty()
  exactAddress?: string;

  @IsNumber()
  numberOfRooms: number;

  @IsNumber()
  totalArea: number;

  @IsNumber()
  floor: number;

  @IsOptional()
  @IsString()
  documentation?: string;

  @IsString()
  heating: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  furniture?: string;

  @IsNumber()
  priceVisible: number;

  @IsNumber()
  priceHidden: number;

  

  @IsOptional()
  @IsArray()
  photos?: string[];
}
