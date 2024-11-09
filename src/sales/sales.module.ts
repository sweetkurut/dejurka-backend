// src/sales/sales.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { UsersModule } from '../users/users.module';
import { RealEstateModule } from '../real-estate/real-estate.module';
import { Sale } from './entities/sale.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sale]), UsersModule, RealEstateModule],
  providers: [SalesService],
  controllers: [SalesController],
})
export class SalesModule {}
