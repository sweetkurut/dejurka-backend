import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RepairService } from './repair.service';
import { CreateRepairDto } from './dto/create-repair.dto';
import { UpdateRepairDto } from './dto/update-repair.dto';

@Controller('repair')
export class RepairController {
  constructor(private readonly repairService: RepairService) {}

  @Get()
  findAll() {
    return this.repairService.findAll();
  }

  @Post()
  create(@Body('name') name: string) {
    return this.repairService.create(name);
  }
}
