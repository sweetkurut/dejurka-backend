// src/sales/sales.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from 'src/users/enum/role.enum';

@Controller('sales')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Get()
  @Roles(Role.Admin, Role.Manager)
  findAll() {
    return this.salesService.findAll();
  }

  @Get(':id')
  @Roles(Role.Admin, Role.Manager)
  findOne(@Param('id') id: string) {
    return this.salesService.findOne(+id);
  }

  @Post()
  @Roles(Role.Admin, Role.Manager)
  create(@Body() createSaleDto: CreateSaleDto) {
    return this.salesService.create(createSaleDto);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  remove(@Param('id') id: string) {
    return this.salesService.remove(+id);
  }
}
