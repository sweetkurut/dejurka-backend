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
} from '@nestjs/common';
import { RealEstateService } from './real-estate.service';
import { CreateRealEstateDto } from './dto/create-real-estate.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from 'src/users/enum/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('real-estate')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RealEstateController {
  constructor(private readonly realEstateService: RealEstateService) {}

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
  create(@Body() createRealEstateDto: CreateRealEstateDto) {
    return this.realEstateService.create(createRealEstateDto);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file, 'Загруженный файл');
  }

  @Delete(':id')
  @Roles(Role.Admin)
  remove(@Param('id') id: string) {
    return this.realEstateService.remove(+id);
  }
}
