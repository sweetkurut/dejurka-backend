import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReferencesService } from './references.service';
import { ReferencesController } from './references.controller';
import {
  District,
  DocumentEntity,
  FurnitureType,
  HeatingType,
  RenovationType,
  RoomCount,
  Series,
} from './entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Series,
      RenovationType,
      District,
      RoomCount,
      DocumentEntity,
      HeatingType,
      FurnitureType,
    ]),
  ],
  controllers: [ReferencesController],
  providers: [ReferencesService],
  exports: [ReferencesService],
})
export class ReferencesModule {}
