import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FurnitureService } from './furniture.service';
import { CreateFurnitureDto } from './dto/create-furniture.dto';
import { UpdateFurnitureDto } from './dto/update-furniture.dto';

@Controller('furniture')
export class FurnitureController {
  constructor(private readonly furnitureService: FurnitureService) {}
  @Get()
  findAll() {
    return this.furnitureService.findAll();
  }

  @Post()
  create(@Body('name') name: string) {
    return this.furnitureService.create(name);
  }

  @Delete(':id') 
  delete(@Param('id') id: string) {
    return this.furnitureService.delete(+id);
  }
}
