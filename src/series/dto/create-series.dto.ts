// src/series/dto/create-series.dto.ts
import { IsString } from 'class-validator';

export class CreateSeriesDto {
  @IsString()
  name: string;
}
