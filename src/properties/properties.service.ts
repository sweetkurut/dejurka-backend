import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Property } from './entities/property.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(Property)
    private readonly propertyRepo: Repository<Property>,
  ) {}

  async findAll(user: User) {
    if (user.role === 'admin') {
      return this.propertyRepo.find();
    } else {
      return this.propertyRepo.find({ where: { created_by: { id: user.id } } });
    }
  }

  async findOne(id: string) {
    const property = await this.propertyRepo.findOne({ where: { id } });
    if (!property) throw new NotFoundException('Объект не найден');
    return property;
  }

  async create(data: Partial<Property>, user: User) {
    const property = this.propertyRepo.create({ ...data, created_by: user });
    return this.propertyRepo.save(property);
  }

  async update(id: string, data: Partial<Property>, user: User) {
    const property = await this.findOne(id);
    if (property.created_by.id !== user.id && user.role !== 'admin') {
      throw new NotFoundException('Нет доступа для редактирования');
    }
    Object.assign(property, data);
    return this.propertyRepo.save(property);
  }

  async remove(id: string, user: User) {
    const property = await this.findOne(id);
    if (property.created_by.id !== user.id && user.role !== 'admin') {
      throw new NotFoundException('Нет доступа для удаления');
    }
    return this.propertyRepo.remove(property);
  }
}
