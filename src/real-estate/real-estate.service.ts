// src/real-estate/real-estate.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRealEstateDto } from './dto/create-real-estate.dto';
import { RealEstate } from './entities/real-estate.entity';
import { Sale } from 'src/sales/entities/sale.entity';
import { Repair } from 'src/repair/entities/repair.entity';
import { Room } from 'src/rooms/entities/room.entity';
import { Furniture } from 'src/furniture/entities/furniture.entity';
import { Heating } from 'src/heating/entities/heating.entity';
import { Documentation } from 'src/documentation/entities/documentation.entity';

@Injectable()
export class RealEstateService {
  constructor(
    @InjectRepository(RealEstate)
    private realEstateRepository: Repository<RealEstate>,
    @InjectRepository(Sale)
    private salesRepository: Repository<Sale>,
    @InjectRepository(Repair)
    private repairRepository: Repository<Repair>,
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    @InjectRepository(Furniture)
    private furnitureRepository: Repository<Furniture>,
    @InjectRepository(Heating)
    private heatingRepository: Repository<Heating>,
    @InjectRepository(Documentation)
    private documentationRepository: Repository<Documentation>
  ) {}

  findAll(): Promise<RealEstate[]> {
    return this.realEstateRepository.find({ relations: ['series', 'user', 'repair'] });
  }

  async findOne(id: number): Promise<RealEstate>  {
    const realEstate = await this.realEstateRepository.findOne({
      where: { id },
      relations: ['series', 'user', 'repair', 'room', 'documentation'],
    });

    if (!realEstate) {
      throw new NotFoundException(`Недвижимость с ID ${id} не найдена.`);
    }

    return realEstate;
  }

  async create(createRealEstateDto: CreateRealEstateDto): Promise<{ message: string; data: RealEstate }> {
    let repair = null;
    let room = null;
    let furniture = null;
    let heating = null;
    let documentation = null;
  
    // Проверяем ремонт
    if (createRealEstateDto.repairId) {
      repair = await this.repairRepository.findOne({ where: { id: createRealEstateDto.repairId } });
      if (!repair) {
        throw new NotFoundException(`Ремонт с ID ${createRealEstateDto.repairId} не найден.`);
      }
    }
  
    // Проверяем комнату
    if (createRealEstateDto.roomId) {
      room = await this.roomRepository.findOne({ where: { id: createRealEstateDto.roomId } });
      if (!room) {
        throw new NotFoundException(`Комната с ID ${createRealEstateDto.roomId} не найдена.`);
      }
    }
  
    // Проверяем мебель
    if (createRealEstateDto.furnitureId) {
      furniture = await this.furnitureRepository.findOne({ where: { id: createRealEstateDto.furnitureId } });
      if (!furniture) {
        throw new NotFoundException(`Мебель с ID ${createRealEstateDto.furnitureId} не найдена.`);
      }
    }
  
    // Проверяем отопление
    if (createRealEstateDto.heatingId) {
      heating = await this.heatingRepository.findOne({ where: { id: createRealEstateDto.heatingId } });
      if (!heating) {
        throw new NotFoundException(`Отопление с ID ${createRealEstateDto.heatingId} не найдено.`);
      }
    }

    if (createRealEstateDto.documentationId) {
      documentation = await this.documentationRepository.findOne({ where: { id: createRealEstateDto.documentationId } });
      if (!documentation) {
        throw new NotFoundException(`Документация с ID ${createRealEstateDto.documentationId} не найдена.`);
      }
    }
  
    // Создаем запись о недвижимости
    const realEstate = this.realEstateRepository.create(createRealEstateDto);
  
    // Привязываем связанные сущности
    if (repair) {
      realEstate.repair = repair;
    }
    if (room) {
      realEstate.room = room;
    }
    if (furniture) {
      realEstate.furniture = furniture;
    }
    if (heating) {
      realEstate.heating = heating;
    }
    if (documentation) {
      realEstate.documentation = documentation;
    }
  
    // Сохраняем в базе данных
    const savedRealEstate = await this.realEstateRepository.save(realEstate);
  
    return { message: 'Недвижимость успешно создана.', data: savedRealEstate };
  }
  
  

  async remove(id: number): Promise<{ message: string }> {
    const realEstate = await this.realEstateRepository.findOne({ where: { id } });

    if (!realEstate) {
      throw new NotFoundException(`Недвижимость с ID ${id} не найдена.`);
    }

    await this.salesRepository.delete(id);
    await this.realEstateRepository.delete(id);

    return { message: `Недвижимость с ID ${id} успешно удалена.` };
  }
}
