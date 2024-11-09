// src/series/series.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { SeriesService } from './series.service';
import { CreateSeriesDto } from './dto/create-series.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from 'src/users/enum/role.enum';

@Controller('series')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SeriesController {
  constructor(private readonly seriesService: SeriesService) {}

  @Get()
  @Roles(Role.Admin, Role.Manager)
  findAll() {
    return this.seriesService.findAll();
  }

  @Get(':id')
  @Roles(Role.Admin, Role.Manager)
  findOne(@Param('id') id: string) {
    return this.seriesService.findOne(+id);
  }

  @Post()
  @Roles(Role.Admin)
  create(@Body() createSeriesDto: CreateSeriesDto) {
    return this.seriesService.create(createSeriesDto);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  remove(@Param('id') id: string) {
    return this.seriesService.remove(+id);
  }
}
