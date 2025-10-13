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
} from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

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
  create(@Body() body: any, @Req() req) {
    return this.propService.create(body, req.user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any, @Req() req) {
    return this.propService.update(id, body, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.propService.remove(id, req.user);
  }
}
