import { Module } from '@nestjs/common';
import { HeatingService } from './heating.service';
import { HeatingController } from './heating.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Heating } from './entities/heating.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Heating])],
  controllers: [HeatingController],
  providers: [HeatingService],
  exports: [HeatingService, TypeOrmModule],
})
export class HeatingModule {}
