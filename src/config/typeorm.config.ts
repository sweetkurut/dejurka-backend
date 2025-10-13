import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Property } from '../properties/entities/property.entity';
import { Series } from '../references/entities/series.entity';
import { RenovationType } from '../references/entities/renovation-type.entity';
import { District } from '../references/entities/district.entity';
import { RoomCount } from '../references/entities/room-count.entity';
import { DocumentEntity } from '../references/entities/document.entity';
import { HeatingType } from '../references/entities/heating-type.entity';
import { FurnitureType } from '../references/entities/furniture-type.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres',
  database: process.env.DB_NAME || 'dezhurka',
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
