import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDocumentationDto } from './dto/create-documentation.dto';
import { UpdateDocumentationDto } from './dto/update-documentation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Documentation } from './entities/documentation.entity';

@Injectable()
export class DocumentationService {
  
  constructor(
    @InjectRepository(Documentation)
    private readonly documentationRepository: Repository<Documentation>,
  ) {}


  async findAll() {
    const docs = await this.documentationRepository.find();
    return {
      data: docs,
    };
  }

  async create(name: string) {
    if (!name || name.trim().length === 0) {
      throw new BadRequestException('Наименование не может быть пустым');
    }

    const doc = this.documentationRepository.create({ name });
    const savedFurniture = await this.documentationRepository.save(doc);
    return {
      message: 'Документация успешно создана',
      // data: savedFurniture,
    };
  }

  async delete(id: number) {
    if (isNaN(id)) {
      throw new BadRequestException('Некорректный ID');
    }

    const result = await this.documentationRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Документация с таким ID не найдена');
    }

    return {
      message: 'Документация успешно удалена',
      data: { id },
    };
  }
}
