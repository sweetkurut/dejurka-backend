import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Series,
  RenovationType,
  District,
  RoomCount,
  DocumentEntity,
  HeatingType,
  FurnitureType,
} from './entities';

@Injectable()
export class ReferencesService {
  constructor(
    @InjectRepository(Series) private seriesRepo: Repository<Series>,
    @InjectRepository(RenovationType)
    private renovationRepo: Repository<RenovationType>,
    @InjectRepository(District) private districtRepo: Repository<District>,
    @InjectRepository(RoomCount) private roomCountRepo: Repository<RoomCount>,
    @InjectRepository(DocumentEntity)
    private documentRepo: Repository<DocumentEntity>,
    @InjectRepository(HeatingType) private heatingRepo: Repository<HeatingType>,
    @InjectRepository(FurnitureType)
    private furnitureRepo: Repository<FurnitureType>,
  ) {}

  private getRepo(type: string): Repository<any> {
    switch (type.toLowerCase()) {
      case 'series':
        return this.seriesRepo;
      case 'renovationtype':
        return this.renovationRepo;
      case 'district':
        return this.districtRepo;
      case 'roomcount':
        return this.roomCountRepo;
      case 'document':
        return this.documentRepo;
      case 'heatingtype':
        return this.heatingRepo;
      case 'furnituretype':
        return this.furnitureRepo;
      default:
        throw new NotFoundException('Тип справочника не найден');
    }
  }

  async findAll(type: string) {
    const repo = this.getRepo(type);
    return repo.find();
  }

  async create(type: string, data: any) {
    const repo = this.getRepo(type);
    const entity = repo.create(data);
    return repo.save(entity);
  }

  async update(type: string, id: string, data: any) {
    const repo = this.getRepo(type);
    const entity = await repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('Элемент не найден');
    Object.assign(entity, data);
    return repo.save(entity);
  }

  async remove(type: string, id: string) {
    const repo = this.getRepo(type);
    const entity = await repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('Элемент не найден');
    return repo.remove(entity);
  }
}
