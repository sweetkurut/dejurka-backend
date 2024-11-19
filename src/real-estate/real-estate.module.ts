// src/real-estate/real-estate.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RealEstateService } from './real-estate.service';
import { RealEstateController } from './real-estate.controller';
import { UsersModule } from '../users/users.module';
import { Series } from './entities/series.entity';
import { RealEstate } from './entities/real-estate.entity';
import { Sale } from 'src/sales/entities/sale.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RealEstate, Series, Sale]), UsersModule],
  providers: [RealEstateService],
  controllers: [RealEstateController],
  exports: [RealEstateService, TypeOrmModule],
})
export class RealEstateModule {}
