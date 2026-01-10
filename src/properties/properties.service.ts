import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Property } from './entities/property.entity';
import { User } from '../users/entities/user.entity';
import { CreatePropertyDto } from './dto/create-property.dto';
import { DataSource } from 'typeorm';
import {
  Series,
  District,
  RenovationType,
  RoomCount,
  HeatingType,
  FurnitureType,
  DocumentEntity,
} from 'src/references/entities';
import {
  PropertyObject,
  PropertyObjectType,
} from './entities/property-object.entity';
import { House } from './entities/house.entity';
import { Land } from './entities/land.entity';
import { Commercial } from './entities/commercial.entity';
import { CreateHouseDto } from './dto/create-house.dto';
import { UpdateHouseDto } from './dto/update-house.dto';
import { CreateLandDto } from './dto/create-land.dto';
import { UpdateLandDto } from './dto/update-land.dto';
import { CreateCommercialDto } from './dto/create-commercial.dto';
import { UpdateCommercialDto } from './dto/update-commercial.dto';

@Injectable()
export class PropertiesService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Property)
    private readonly propertyRepo: Repository<Property>,
    @InjectRepository(PropertyObject)
    private readonly propertyObjectRepo: Repository<PropertyObject>,
    @InjectRepository(House)
    private readonly houseRepo: Repository<House>,
    @InjectRepository(Land)
    private readonly landRepo: Repository<Land>,
    @InjectRepository(Commercial)
    private readonly commercialRepo: Repository<Commercial>,
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

  // House methods (already provided, included for completeness)
  async createHouse(dto: CreateHouseDto, user: User) {
    if (dto.price_hidden && user.role !== 'admin') {
      throw new NotFoundException('Нет доступа к скрытой цене');
    }
    const district = await this.districtRepo.findOneBy({ id: dto.districtId });
    const documentType = await this.docRepo.findOneBy({
      id: dto.documentTypeId,
    });
    if (!district || !documentType) {
      throw new NotFoundException('Справочник не найден');
    }
    return this.dataSource.transaction(async (manager) => {
      const base = manager.create(PropertyObject, {
        title: dto.title,
        description: dto.description,
        price_visible: dto.price_visible,
        price_hidden: dto.price_hidden,
        owner_phone: dto.owner_phone,
        photos: dto.photos,
        district,
        document_type: documentType,
        type: PropertyObjectType.HOUSE,
        created_by: user,
      });
      const savedBase = await manager.save(base);
      const house = manager.create(House, {
        property_id: savedBase.id,
        property: savedBase,
        house_area: dto.house_area,
        land_area: dto.land_area,
        communications: dto.communications,
      });
      await manager.save(house);
      const safeProperty =
        user.role === 'admin'
          ? savedBase
          : (({ price_hidden, ...rest }) => rest)(savedBase as any);
      return {
        property: safeProperty,
        details: {
          house_area: house.house_area,
          land_area: house.land_area,
          communications: house.communications,
        },
      };
    });
  }

  async findAllHouses(user: User) {
    const houses = await this.houseRepo.find({
      relations: {
        property: true,
      },
    });
    return houses.map((h) => {
      if (user.role !== 'admin') {
        const { price_hidden, ...safe } = h.property as any;
        return { ...h, property: safe };
      }
      return h;
    });
  }

  async findHouseById(id: string, user: User) {
    const house = await this.houseRepo.findOne({
      where: { property: { id } },
      relations: { property: true },
    });
    if (!house) {
      throw new NotFoundException('Дом не найден');
    }
    if (user.role !== 'admin') {
      const { price_hidden, ...safe } = house.property as any;
      return { ...house, property: safe };
    }
    return house;
  }

  async updateHouse(id: string, dto: UpdateHouseDto, user: User) {
    const house = await this.houseRepo.findOne({
      where: { property: { id } },
      relations: { property: true },
    });
    if (!house) {
      throw new NotFoundException('Дом не найден');
    }
    if (house.property.created_by.id !== user.id && user.role !== 'admin') {
      throw new NotFoundException('Нет доступа');
    }
    if (dto.price_hidden && user.role !== 'admin') {
      throw new NotFoundException('Нет доступа к скрытой цене');
    }
    Object.assign(house.property, {
      title: dto.title ?? house.property.title,
      description: dto.description ?? house.property.description,
      price_visible: dto.price_visible ?? house.property.price_visible,
      price_hidden: dto.price_hidden ?? house.property.price_hidden,
      owner_phone: dto.owner_phone ?? house.property.owner_phone,
    });
    Object.assign(house, {
      house_area: dto.house_area ?? house.house_area,
      land_area: dto.land_area ?? house.land_area,
      communications: dto.communications ?? house.communications,
    });
    await this.propertyObjectRepo.save(house.property);
    await this.houseRepo.save(house);
    return this.findHouseById(id, user);
  }

  async removeHouse(id: string, user: User) {
    const house = await this.houseRepo.findOne({
      where: { property: { id } },
      relations: { property: true },
    });
    if (!house) {
      throw new NotFoundException('Дом не найден');
    }
    if (house.property.created_by.id !== user.id && user.role !== 'admin') {
      throw new NotFoundException('Нет доступа');
    }
    await this.propertyObjectRepo.remove(house.property);
    return { success: true };
  }

  async addPhotosToHouse(id: string, photos: string[], user: User) {
    const house = await this.houseRepo.findOne({
      where: { property: { id } },
      relations: { property: { created_by: true } },
    });
    if (!house) {
      throw new NotFoundException('Дом не найден');
    }
    if (house.property.created_by.id !== user.id && user.role !== 'admin') {
      throw new NotFoundException('Нет доступа');
    }
    house.property.photos = [...(house.property.photos || []), ...photos];
    return this.propertyObjectRepo.save(house.property);
  }

  async createLand(dto: CreateLandDto, user: User) {
    if (dto.price_hidden && user.role !== 'admin') {
      throw new NotFoundException('Нет доступа к скрытой цене');
    }

    const district = await this.districtRepo.findOneBy({ id: dto.districtId });
    const documentType = await this.docRepo.findOneBy({
      id: dto.documentTypeId,
    });

    if (!district || !documentType) {
      throw new NotFoundException('Справочник не найден');
    }

    return this.dataSource.transaction(async (manager) => {
      const base = manager.create(PropertyObject, {
        title: dto.title,
        description: dto.description,
        price_visible: dto.price_visible,
        price_hidden: dto.price_hidden,
        owner_phone: dto.owner_phone,
        photos: dto.photos,
        district,
        document_type: documentType,
        type: PropertyObjectType.LAND,
        created_by: user,
      });

      const savedBase = await manager.save(base);

      // ✅ Правильно — НЕ передаём property_id вручную
      const land = manager.create(Land, {
        property: savedBase,
        land_area: dto.land_area,
        communications: dto.communications,
      });

      await manager.save(land);

      const safeProperty =
        user.role === 'admin'
          ? savedBase
          : (({ price_hidden, ...rest }) => rest)(savedBase as any);

      return {
        property: safeProperty,
        details: {
          land_area: land.land_area,
          communications: land.communications,
        },
      };
    });
  }

  async findAllLands(user: User) {
    const lands = await this.landRepo.find({
      relations: {
        property: true,
      },
    });
    return lands.map((l) => {
      if (user.role !== 'admin') {
        const { price_hidden, ...safe } = l.property as any;
        return { ...l, property: safe };
      }
      return l;
    });
  }

  async findLandById(id: string, user: User) {
    const land = await this.landRepo.findOne({
      where: { property: { id } },
      relations: { property: true },
    });
    if (!land) {
      throw new NotFoundException('Участок не найден');
    }
    if (user.role !== 'admin') {
      const { price_hidden, ...safe } = land.property as any;
      return { ...land, property: safe };
    }
    return land;
  }

  async updateLand(id: string, dto: UpdateLandDto, user: User) {
    const land = await this.landRepo.findOne({
      where: { property: { id } },
      relations: { property: true },
    });
    if (!land) {
      throw new NotFoundException('Участок не найден');
    }
    if (land.property.created_by.id !== user.id && user.role !== 'admin') {
      throw new NotFoundException('Нет доступа');
    }
    if (dto.price_hidden && user.role !== 'admin') {
      throw new NotFoundException('Нет доступа к скрытой цене');
    }
    Object.assign(land.property, {
      title: dto.title ?? land.property.title,
      description: dto.description ?? land.property.description,
      price_visible: dto.price_visible ?? land.property.price_visible,
      price_hidden: dto.price_hidden ?? land.property.price_hidden,
      owner_phone: dto.owner_phone ?? land.property.owner_phone,
    });
    Object.assign(land, {
      land_area: dto.land_area ?? land.land_area,
      communications: dto.communications ?? land.communications,
    });
    await this.propertyObjectRepo.save(land.property);
    await this.landRepo.save(land);
    return this.findLandById(id, user);
  }

  async removeLand(id: string, user: User) {
    const land = await this.landRepo.findOne({
      where: { property: { id } },
      relations: { property: true },
    });
    if (!land) {
      throw new NotFoundException('Участок не найден');
    }
    if (land.property.created_by.id !== user.id && user.role !== 'admin') {
      throw new NotFoundException('Нет доступа');
    }
    await this.propertyObjectRepo.remove(land.property);
    return { success: true };
  }

  async addPhotosToLand(id: string, photos: string[], user: User) {
    const land = await this.landRepo.findOne({
      where: { property: { id } },
      relations: { property: { created_by: true } },
    });
    if (!land) {
      throw new NotFoundException('Участок не найден');
    }
    if (land.property.created_by.id !== user.id && user.role !== 'admin') {
      throw new NotFoundException('Нет доступа');
    }
    land.property.photos = [...(land.property.photos || []), ...photos];
    return this.propertyObjectRepo.save(land.property);
  }

  // Commercial methods
  async createCommercial(dto: CreateCommercialDto, user: User) {
    if (dto.price_hidden && user.role !== 'admin') {
      throw new NotFoundException('Нет доступа к скрытой цене');
    }
    const district = await this.districtRepo.findOneBy({ id: dto.districtId });
    const documentType = await this.docRepo.findOneBy({
      id: dto.documentTypeId,
    });
    if (!district || !documentType) {
      throw new NotFoundException('Справочник не найден');
    }
    return this.dataSource.transaction(async (manager) => {
      const base = manager.create(PropertyObject, {
        title: dto.title,
        description: dto.description,
        price_visible: dto.price_visible,
        price_hidden: dto.price_hidden,
        owner_phone: dto.owner_phone,
        photos: dto.photos,
        district,
        document_type: documentType,
        type: PropertyObjectType.COMMERCIAL,
        created_by: user,
      });
      const savedBase = await manager.save(base);
      const commercial = manager.create(Commercial, {
        property_id: savedBase.id,
        property: savedBase,
        total_area: dto.total_area,
        floors: dto.floors,
        communications: dto.communications,
      });
      await manager.save(commercial);
      const safeProperty =
        user.role === 'admin'
          ? savedBase
          : (({ price_hidden, ...rest }) => rest)(savedBase as any);
      return {
        property: safeProperty,
        details: {
          total_area: commercial.total_area,
          floors: commercial.floors,
          communications: commercial.communications,
        },
      };
    });
  }

  async findAllCommercials(user: User) {
    const commercials = await this.commercialRepo.find({
      relations: {
        property: true,
      },
    });
    return commercials.map((c) => {
      if (user.role !== 'admin') {
        const { price_hidden, ...safe } = c.property as any;
        return { ...c, property: safe };
      }
      return c;
    });
  }

  async findCommercialById(id: string, user: User) {
    const commercial = await this.commercialRepo.findOne({
      where: { property: { id } },
      relations: { property: true },
    });
    if (!commercial) {
      throw new NotFoundException('Коммерческое помещение не найдено');
    }
    if (user.role !== 'admin') {
      const { price_hidden, ...safe } = commercial.property as any;
      return { ...commercial, property: safe };
    }
    return commercial;
  }

  async updateCommercial(id: string, dto: UpdateCommercialDto, user: User) {
    const commercial = await this.commercialRepo.findOne({
      where: { property: { id } },
      relations: { property: true },
    });
    if (!commercial) {
      throw new NotFoundException('Коммерческое помещение не найдено');
    }
    if (
      commercial.property.created_by.id !== user.id &&
      user.role !== 'admin'
    ) {
      throw new NotFoundException('Нет доступа');
    }
    if (dto.price_hidden && user.role !== 'admin') {
      throw new NotFoundException('Нет доступа к скрытой цене');
    }
    Object.assign(commercial.property, {
      title: dto.title ?? commercial.property.title,
      description: dto.description ?? commercial.property.description,
      price_visible: dto.price_visible ?? commercial.property.price_visible,
      price_hidden: dto.price_hidden ?? commercial.property.price_hidden,
      owner_phone: dto.owner_phone ?? commercial.property.owner_phone,
    });
    Object.assign(commercial, {
      total_area: dto.total_area ?? commercial.total_area,
      floors: dto.floors ?? commercial.floors,
      communications: dto.communications ?? commercial.communications,
    });
    await this.propertyObjectRepo.save(commercial.property);
    await this.commercialRepo.save(commercial);
    return this.findCommercialById(id, user);
  }

  async removeCommercial(id: string, user: User) {
    const commercial = await this.commercialRepo.findOne({
      where: { property: { id } },
      relations: { property: true },
    });
    if (!commercial) {
      throw new NotFoundException('Коммерческое помещение не найдено');
    }
    if (
      commercial.property.created_by.id !== user.id &&
      user.role !== 'admin'
    ) {
      throw new NotFoundException('Нет доступа');
    }
    await this.propertyObjectRepo.remove(commercial.property);
    return { success: true };
  }

  async addPhotosToCommercial(id: string, photos: string[], user: User) {
    const commercial = await this.commercialRepo.findOne({
      where: { property: { id } },
      relations: { property: { created_by: true } },
    });
    if (!commercial) {
      throw new NotFoundException('Коммерческое помещение не найдено');
    }
    if (
      commercial.property.created_by.id !== user.id &&
      user.role !== 'admin'
    ) {
      throw new NotFoundException('Нет доступа');
    }
    commercial.property.photos = [
      ...(commercial.property.photos || []),
      ...photos,
    ];
    return this.propertyObjectRepo.save(commercial.property);
  }
}
