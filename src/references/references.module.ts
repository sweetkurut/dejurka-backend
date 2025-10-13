import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReferencesService } from './references.service';
import { ReferencesController } from './references.controller';
import {
  Series,
  RenovationType,
  District,
  RoomCount,
  DocumentEntity,
  HeatingType,
  FurnitureType,
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
