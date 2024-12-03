import { Module } from '@nestjs/common';
import { FurnitureService } from './furniture.service';
import { FurnitureController } from './furniture.controller';
import { Furniture } from './entities/furniture.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Furniture])],
  controllers: [FurnitureController],
  providers: [FurnitureService],
  exports: [FurnitureService, TypeOrmModule],
})
export class FurnitureModule {}
