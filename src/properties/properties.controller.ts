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

@ApiTags('Properties')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('properties')
export class PropertiesController {
  constructor(private readonly propService: PropertiesService) {}

  @Get()
  getAll(@Req() req) {
    return this.propService.findAll(req.user);
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.propService.findOne(id);
  }

  @Post()
  create(@Body() body: CreatePropertyDto, @Req() req) {
    console.log(req.user);
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
  async uploadPhotos(
    @Param('id') propertyId: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req,
  ) {
    const paths = files.map((f) => `/uploads/properties/${f.filename}`);
    return this.propService.addPhotos(propertyId, paths, req.user);
  }
}
