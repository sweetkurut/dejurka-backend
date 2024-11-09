// src/sales/dto/create-sale.dto.ts
import { IsNumber, IsDateString } from 'class-validator';

export class CreateSaleDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  realEstateId: number;

  @IsDateString()
  saleDate: string;
}
