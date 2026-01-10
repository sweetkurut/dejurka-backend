import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertiesService } from './properties.service';
import { PropertiesController } from './properties.controller';
import { Property } from './entities/property.entity';
import { UsersModule } from '../users/users.module';
import { ReferencesModule } from '../references/references.module';
import { FilesModule } from '../files/files.module';
import {
  Series,
  District,
  RenovationType,
  RoomCount,
  HeatingType,
  FurnitureType,
  DocumentEntity,
} from '../references/entities';
import { PropertyObject } from './entities/property-object.entity';
import { House } from './entities/house.entity';
import { Land } from './entities/land.entity';
import { Commercial } from './entities/commercial.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Property,
      PropertyObject,
      House,
      Land,
      Commercial,
      Series,
      District,
      RenovationType,
      RoomCount,
      HeatingType,
      FurnitureType,
      DocumentEntity,
    ]),
    UsersModule,
    ReferencesModule,
    FilesModule,
  ],
  controllers: [PropertiesController],
  providers: [PropertiesService],
})
export class PropertiesModule {}
