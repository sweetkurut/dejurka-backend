// src/real-estate/real-estate.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UploadedFiles,
} from '@nestjs/common';
import { RealEstateService } from './real-estate.service';
import { CreateRealEstateDto } from './dto/create-real-estate.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from 'src/users/enum/role.enum';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

import { writeFile } from 'fs/promises';
import { join } from 'path';
import * as uuid from 'uuid';
import { mkdirSync, writeFileSync } from 'fs';


@Controller('real-estate')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RealEstateController {
  constructor(private readonly realEstateService: RealEstateService) { }

  @Get()
  @Roles(Role.Admin, Role.Manager)
  findAll() {
    return this.realEstateService.findAll();
  }

  @Get(':id')
  @Roles(Role.Admin, Role.Manager)
  findOne(@Param('id') id: string) {
    return this.realEstateService.findOne(+id);
  }

  @Post()
@Roles(Role.Admin, Role.Manager)
@UseInterceptors(FilesInterceptor('image', 10)) // Для обработки нескольких файлов
async create(
  @Body() createRealEstateDto: CreateRealEstateDto,
  @UploadedFiles() images?: Express.Multer.File[], // Получаем массив файлов
) {
  if (images && images.length > 0) {
    const imagePaths = [];
    const directoryPath = join(__dirname, '../../uploads/real-estate');
    mkdirSync(directoryPath, { recursive: true });
  
    for (const image of images) {
      const filename = `${uuid.v4()}-${image.originalname}`;
      const filePath = join(directoryPath, filename);
      writeFileSync(filePath, image.buffer);
  
      // Добавляем путь к изображению
      imagePaths.push(`/uploads/real-estate/${filename}`);
    }
  
    // Устанавливаем пути всех изображений
    createRealEstateDto.photos = imagePaths;
  } else {
    throw new BadRequestException('No images uploaded');
  }
  

  if (!createRealEstateDto.photos || createRealEstateDto.photos.length === 0) {
    throw new BadRequestException('Images are required');
  }

  // Сохраняем недвижимость
  return this.realEstateService.create(createRealEstateDto);
}

  // @Post('upload')
  // @UseInterceptors(FileInterceptor('file'))
  // uploadFile(@UploadedFile() file: Express.Multer.File) {
  //   console.log(file, 'Загруженный файл');
  // }

  @Delete(':id')
  @Roles(Role.Admin, Role.Manager)
  remove(@Param('id') id: string) {
    return this.realEstateService.remove(+id);
  }
}
