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
      entities: [User, RealEstate, Series, Sale],
      synchronize: true,
      autoLoadEntities: true,
    }),
    UsersModule,
    AuthModule,
    RealEstateModule,
    SeriesModule,
    SalesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
