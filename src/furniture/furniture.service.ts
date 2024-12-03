import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Furniture } from './entities/furniture.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FurnitureService {
  constructor(
    @InjectRepository(Furniture)
    private furnitureRepository: Repository<Furniture>,
  ) {}

  async findAll() {
    const furnitures = await this.furnitureRepository.find();
    return {
      data: furnitures,
    };
  }

  async create(name: string) {
    if (!name || name.trim().length === 0) {
      throw new BadRequestException('Наименование не может быть пустым');
    }

    const furniture = this.furnitureRepository.create({ name });
    const savedFurniture = await this.furnitureRepository.save(furniture);
    return {
      message: 'Мебель успешно создана',
      // data: savedFurniture,
    };
  }

  async delete(id: number) {
    if (isNaN(id)) {
      throw new BadRequestException('Некорректный ID');
    }

    const result = await this.furnitureRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Мебель с таким ID не найдена');
    }

    return {
      message: 'Мебель успешно удалена',
      data: { id },
    };
  }
}
