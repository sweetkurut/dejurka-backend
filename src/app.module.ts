import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { RealEstateModule } from './real-estate/real-estate.module';
import { SeriesModule } from './series/series.module';
import { SalesModule } from './sales/sales.module';
import { User } from './users/entities/user.entity';
import { RealEstate } from './real-estate/entities/real-estate.entity';
import { Series } from './real-estate/entities/series.entity';
import { Sale } from './sales/entities/sale.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { RepairModule } from './repair/repair.module';
import { Repair } from './repair/entities/repair.entity';
import { RoomsModule } from './rooms/rooms.module';
import { DocumentationModule } from './documentation/documentation.module';
import { HeatingModule } from './heating/heating.module';
import { FurnitureModule } from './furniture/furniture.module';
import { Room } from './rooms/entities/room.entity';
import { Heating } from './heating/entities/heating.entity';
import { Furniture } from './furniture/entities/furniture.entity';
import { Documentation } from './documentation/entities/documentation.entity';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'dejurka',
      entities: [User, RealEstate, Series, Sale, Repair, Room, Heating, Furniture, Documentation],
      synchronize: true,
      autoLoadEntities: true,
    }),
    UsersModule,
    AuthModule,
    RealEstateModule,
    SeriesModule,
    SalesModule,
    RepairModule,
    RoomsModule,
    DocumentationModule,
    HeatingModule,
    FurnitureModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
