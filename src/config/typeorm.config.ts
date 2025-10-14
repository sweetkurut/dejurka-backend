import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Property } from '../properties/entities/property.entity';
import {
  District,
  DocumentEntity,
  FurnitureType,
  HeatingType,
  RenovationType,
  RoomCount,
  Series,
} from 'src/references/entities';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'root',
  database: process.env.DB_NAME || 'dezhurka-system',
  entities: [
    User,
    Property,
    Series,
    RenovationType,
    District,
    RoomCount,
    DocumentEntity,
    HeatingType,
    FurnitureType,
  ],
  synchronize: true, // ⚠️ В продакшне выключить
};
