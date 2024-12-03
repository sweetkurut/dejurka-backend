import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DocumentationService } from './documentation.service';
import { CreateDocumentationDto } from './dto/create-documentation.dto';
import { UpdateDocumentationDto } from './dto/update-documentation.dto';

@Controller('documentation')
export class DocumentationController {
  constructor(private readonly documentationService: DocumentationService) {}

  @Get()
  findAll() {
    return this.documentationService.findAll();
  }

  @Post()
  create(@Body('name') name: string) {
    return this.documentationService.create(name);
  }

  @Delete(':id') 
  delete(@Param('id') id: string) {
    return this.documentationService.delete(+id);
  }
}
