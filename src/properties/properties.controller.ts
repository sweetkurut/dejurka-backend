import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreatePropertyDto } from './dto/create-property.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CreateHouseDto } from './dto/create-house.dto';
import { UpdateHouseDto } from './dto/update-house.dto';
import { CreateLandDto } from './dto/create-land.dto';
import { UpdateLandDto } from './dto/update-land.dto';
import { CreateCommercialDto } from './dto/create-commercial.dto';
import { UpdateCommercialDto } from './dto/update-commercial.dto';

@ApiTags('Properties')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('properties')
export class PropertiesController {
  constructor(private readonly propService: PropertiesService) {}

  // ========================= HOUSE =========================

  @Post('house')
  createHouse(@Body() dto: CreateHouseDto, @Req() req) {
    return this.propService.createHouse(dto, req.user);
  }

  @Get('house')
  getHouses(@Req() req) {
    return this.propService.findAllHouses(req.user);
  }

  @Get('house/:id')
  getHouse(@Param('id') id: string, @Req() req) {
    return this.propService.findHouseById(id, req.user);
  }

  @Patch('house/:id')
  updateHouse(
    @Param('id') id: string,
    @Body() dto: UpdateHouseDto,
    @Req() req,
  ) {
    return this.propService.updateHouse(id, dto, req.user);
  }

  @Delete('house/:id')
  removeHouse(@Param('id') id: string, @Req() req) {
    return this.propService.removeHouse(id, req.user);
  }

  @Post('house/:id/photos')
  @UseInterceptors(
    FilesInterceptor('photos', 10, {
      storage: diskStorage({
        destination: './uploads/properties',
        filename: (_, file, cb) => {
          const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          cb(null, unique + extname(file.originalname));
        },
      }),
    }),
  )
  uploadHousePhotos(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req,
  ) {
    const paths = files.map((f) => `/uploads/properties/${f.filename}`);
    return this.propService.addPhotosToHouse(id, paths, req.user);
  }

  // ========================= LAND =========================

  @Post('land')
  createLand(@Body() dto: CreateLandDto, @Req() req) {
    return this.propService.createLand(dto, req.user);
  }

  @Get('land')
  getLands(@Req() req) {
    return this.propService.findAllLands(req.user);
  }

  @Get('land/:id')
  getLand(@Param('id') id: string, @Req() req) {
    return this.propService.findLandById(id, req.user);
  }

  @Patch('land/:id')
  updateLand(@Param('id') id: string, @Body() dto: UpdateLandDto, @Req() req) {
    return this.propService.updateLand(id, dto, req.user);
  }

  @Delete('land/:id')
  removeLand(@Param('id') id: string, @Req() req) {
    return this.propService.removeLand(id, req.user);
  }

  @Post('land/:id/photos')
  @UseInterceptors(
    FilesInterceptor('photos', 10, {
      storage: diskStorage({
        destination: './uploads/properties',
        filename: (_, file, cb) => {
          const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          cb(null, unique + extname(file.originalname));
        },
      }),
    }),
  )
  uploadLandPhotos(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req,
  ) {
    const paths = files.map((f) => `/uploads/properties/${f.filename}`);
    return this.propService.addPhotosToLand(id, paths, req.user);
  }

  // ========================= COMMERCIAL =========================

  @Post('commercial')
  createCommercial(@Body() dto: CreateCommercialDto, @Req() req) {
    return this.propService.createCommercial(dto, req.user);
  }

  @Get('commercial')
  getCommercials(@Req() req) {
    return this.propService.findAllCommercials(req.user);
  }

  @Get('commercial/:id')
  getCommercial(@Param('id') id: string, @Req() req) {
    return this.propService.findCommercialById(id, req.user);
  }

  @Patch('commercial/:id')
  updateCommercial(
    @Param('id') id: string,
    @Body() dto: UpdateCommercialDto,
    @Req() req,
  ) {
    return this.propService.updateCommercial(id, dto, req.user);
  }

  @Delete('commercial/:id')
  removeCommercial(@Param('id') id: string, @Req() req) {
    return this.propService.removeCommercial(id, req.user);
  }

  @Post('commercial/:id/photos')
  @UseInterceptors(
    FilesInterceptor('photos', 10, {
      storage: diskStorage({
        destination: './uploads/properties',
        filename: (_, file, cb) => {
          const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          cb(null, unique + extname(file.originalname));
        },
      }),
    }),
  )
  uploadCommercialPhotos(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req,
  ) {
    const paths = files.map((f) => `/uploads/properties/${f.filename}`);
    return this.propService.addPhotosToCommercial(id, paths, req.user);
  }

  // ========================= BASE PROPERTIES =========================

  @Get()
  getAll(@Req() req) {
    return this.propService.findAll(req.user);
  }

  @Post()
  create(@Body() body: CreatePropertyDto, @Req() req) {
    return this.propService.create(body, req.user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: CreatePropertyDto, @Req() req) {
    return this.propService.update(id, body, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.propService.remove(id, req.user);
  }

  @Post(':id/photos')
  @UseInterceptors(
    FilesInterceptor('photos', 10, {
      storage: diskStorage({
        destination: './uploads/properties',
        filename: (_, file, cb) => {
          const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          cb(null, unique + extname(file.originalname));
        },
      }),
    }),
  )
  uploadPhotos(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req,
  ) {
    const paths = files.map((f) => `/uploads/properties/${f.filename}`);
    return this.propService.addPhotos(id, paths, req.user);
  }

  // ❗ ОБЯЗАТЕЛЬНО В САМОМ КОНЦЕ
  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.propService.findOne(id);
  }
}
