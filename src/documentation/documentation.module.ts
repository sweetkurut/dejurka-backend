import { Module } from '@nestjs/common';
import { DocumentationService } from './documentation.service';
import { DocumentationController } from './documentation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Documentation } from './entities/documentation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Documentation])],
  controllers: [DocumentationController],
  providers: [DocumentationService],
  exports: [DocumentationService, TypeOrmModule],
})
export class DocumentationModule {}
