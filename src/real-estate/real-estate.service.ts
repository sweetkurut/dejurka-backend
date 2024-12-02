// src/real-estate/real-estate.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRealEstateDto } from './dto/create-real-estate.dto';
import { RealEstate } from './entities/real-estate.entity';
import { Sale } from 'src/sales/entities/sale.entity';

@Injectable()
export class RealEstateService {
  constructor(
    @InjectRepository(RealEstate)
    private realEstateRepository: Repository<RealEstate>,
    @InjectRepository(Sale)
    private salesRepository: Repository<Sale>,
  ) {}

  findAll(): Promise<RealEstate[]> {
    return this.realEstateRepository.find({ relations: ['series', 'user'] });
  }

  findOne(id: number): Promise<RealEstate> {
    return this.realEstateRepository.findOne({
      where: { id },
      relations: ['series', 'user'],
    });
  }

  async create(createRealEstateDto: CreateRealEstateDto): Promise<{ message: string; data: RealEstate }> {
    const realEstate = this.realEstateRepository.create(createRealEstateDto);
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
