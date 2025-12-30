import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ReferencesService } from './references.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('References')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('references')
export class ReferencesController {
  constructor(private readonly refService: ReferencesService) {}

  // ✅ ЧТЕНИЕ — admin + agent
  @Roles('admin', 'agent')
  @Get(':type')
  findAll(@Param('type') type: string) {
    return this.refService.findAll(type);
  }

  // ❌ СОЗДАНИЕ — ТОЛЬКО admin
  @Roles('admin')
  @Post(':type')
  create(@Param('type') type: string, @Body() body: any) {
    return this.refService.create(type, body);
  }

  // ❌ ОБНОВЛЕНИЕ — ТОЛЬКО admin
  @Roles('admin')
  @Patch(':type/:id')
  update(
    @Param('type') type: string,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.refService.update(type, id, body);
  }

  // ❌ УДАЛЕНИЕ — ТОЛЬКО admin
  @Roles('admin')
  @Delete(':type/:id')
  remove(@Param('type') type: string, @Param('id') id: string) {
    return this.refService.remove(type, id);
  }
}
