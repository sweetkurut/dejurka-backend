import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HeatingService } from './heating.service';
import { CreateHeatingDto } from './dto/create-heating.dto';
import { UpdateHeatingDto } from './dto/update-heating.dto';

@Controller('heating')
export class HeatingController {
  constructor(private readonly heatingService: HeatingService) {}

  @Get()
  findAll() {
    return this.heatingService.findAll();
  }

  @Post()
  create(@Body('name') name: string) {
    return this.heatingService.create(name);
  }
}
