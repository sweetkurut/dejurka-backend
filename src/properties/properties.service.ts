import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Property } from './entities/property.entity';
import { User } from '../users/entities/user.entity';
import { CreatePropertyDto } from './dto/create-property.dto';
import {
  Series,
  District,
  RenovationType,
  RoomCount,
  HeatingType,
  FurnitureType,
  DocumentEntity,
} from 'src/references/entities';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(Property)
    private readonly propertyRepo: Repository<Property>,

    @InjectRepository(Series)
    private readonly seriesRepo: Repository<Series>,

    @InjectRepository(District)
    private readonly districtRepo: Repository<District>,

    @InjectRepository(RenovationType)
    private readonly renovationRepo: Repository<RenovationType>,

    @InjectRepository(RoomCount)
    private readonly roomRepo: Repository<RoomCount>,

    @InjectRepository(HeatingType)
    private readonly heatingRepo: Repository<HeatingType>,

    @InjectRepository(FurnitureType)
    private readonly furnitureRepo: Repository<FurnitureType>,

    @InjectRepository(DocumentEntity)
    private readonly docRepo: Repository<DocumentEntity>,
  ) {}

  // async findAll(user: User) {
  //   if (user.role === 'admin') {
  //     return this.propertyRepo.find();
  //   }
  //   return this.propertyRepo.find({ where: { created_by: { id: user.id } } });
  // }

  async findAll(user: User) {
    const query =
      user.role === 'admin' ? {} : { where: { created_by: { id: user.id } } };

    const [properties, total] = await this.propertyRepo.findAndCount(query);

    return { apartments: properties, total };
  }

  async findOne(id: string) {
    const property = await this.propertyRepo.findOne({ where: { id } });
    if (!property) throw new NotFoundException('Объект не найден');
    return property;
  }

  async create(dto: CreatePropertyDto, user: User) {
    // Проверяем, что все справочники существуют
    const series = await this.seriesRepo.findOneBy({ id: dto.seriesId });
    const district = await this.districtRepo.findOneBy({ id: dto.districtId });
    const renovation = await this.renovationRepo.findOneBy({
      id: dto.renovationTypeId,
    });
    const roomCount = await this.roomRepo.findOneBy({ id: dto.roomsCountId });
    const heating = await this.heatingRepo.findOneBy({ id: dto.heatingTypeId });
    const furniture = await this.furnitureRepo.findOneBy({
      id: dto.furnitureId,
    });

    if (
      !series ||
      !district ||
      !renovation ||
      !roomCount ||
      !heating ||
      !furniture
    ) {
      throw new NotFoundException('Один из справочников не найден');
    }

    const documents = dto.documentsIds?.length
      ? await this.docRepo.findBy({ id: In(dto.documentsIds) })
      : [];

    const property = this.propertyRepo.create({
      // created_by: user,
      // series,
      // district,
      // renovation_type: renovation,
      // rooms_count: roomCount,
      // heating_type: heating,
      // furniture,
      // documents,
      // floor_type: dto.floor_type,
      // area_total: dto.area_total,
      // corner_type: dto.corner_type,
      // address: dto.address,
      // description: dto.description,
      // price_visible: dto.price_visible,
      // price_hidden: dto.price_hidden,
      // photos: dto.photos,
      series,
      district,
      renovation_type: renovation,
      rooms_count: roomCount,
      heating_type: heating,
      furniture,
      documents,
      floor_type: dto.floor_type,
      area_total: dto.area_total,
      corner_type: dto.corner_type,
      address: dto.address,
      description: dto.description,
      price_visible: dto.price_visible,
      price_hidden: dto.price_hidden,
      photos: dto.photos,
      created_by: user,
    });
    property.created_by = user;

    return await this.propertyRepo.save(property);
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

  async addPhotos(id: string, photos: string[], user: User) {
    const property = await this.propertyRepo.findOne({
      where: { id },
      relations: { created_by: true },
    });

    if (!property) {
      throw new NotFoundException('Объект не найден');
    }

    if (property.created_by.id !== user.id && user.role !== 'admin') {
      throw new NotFoundException('Нет доступа');
    }

    property.photos = [...(property.photos || []), ...photos];
    return this.propertyRepo.save(property);
  }
}
