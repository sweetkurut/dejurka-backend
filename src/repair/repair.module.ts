import { Module } from '@nestjs/common';
import { RepairService } from './repair.service';
import { RepairController } from './repair.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repair } from './entities/repair.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Repair])],  // Подключаем репозиторий Repair
  controllers: [RepairController],
  providers: [RepairService],
  exports: [RepairService, TypeOrmModule],  // Экспортируем сервис и репозиторий
})
export class RepairModule {}
