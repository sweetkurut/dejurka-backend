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
} from '@nestjs/common';
import { RealEstateService } from './real-estate.service';
import { CreateRealEstateDto } from './dto/create-real-estate.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from 'src/users/enum/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';

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
  @UseInterceptors(FileInterceptor('image')) // Для обработки файлов
  async create(
    @Body() createRealEstateDto: CreateRealEstateDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    // Если изображение передано как файл
    if (image) {
      const filename = `${uuid.v4()}-${image.originalname}`;
      const directoryPath = join(__dirname, '../../uploads/real-estate');
      const filePath = join(directoryPath, filename);

      // Создаем директорию, если она не существует
      mkdirSync(directoryPath, { recursive: true });

      // Сохраняем файл на диск
      writeFileSync(filePath, image.buffer);

      // Устанавливаем путь к изображению
      createRealEstateDto.imagePath = `/uploads/real-estate/${filename}`;
    }

    // Если изображение передано как Base64
    if (createRealEstateDto.imageBase64) {
      const fileBuffer = Buffer.from(createRealEstateDto.imageBase64, 'base64');
      const filename = `${uuid.v4()}.jpg`;
      const directoryPath = join(__dirname, '../../uploads/real-estate');
      const filePath = join(directoryPath, filename);

      // Создаем директорию, если она не существует
      mkdirSync(directoryPath, { recursive: true });

      // Сохраняем файл на диск
      writeFileSync(filePath, fileBuffer);

      // Устанавливаем путь к изображению
      createRealEstateDto.imagePath = `/uploads/real-estate/${filename}`;
      delete createRealEstateDto.imageBase64; // Удаляем Base64 из DTO
    }

    // Если ни файл, ни Base64 не переданы, бросаем ошибку
    if (!createRealEstateDto.imagePath) {
      throw new BadRequestException('Image is required (file or Base64)');
    }

    // Сохраняем данные
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
