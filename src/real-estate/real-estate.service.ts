// src/real-estate/real-estate.service.ts
import { Injectable } from '@nestjs/common';
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

  create(createRealEstateDto: CreateRealEstateDto): Promise<RealEstate> {
    const realEstate = this.realEstateRepository.create(createRealEstateDto);
    return this.realEstateRepository.save(realEstate);
  }

  async remove(id: number): Promise<void> {
    await this.salesRepository.delete(id);
    await this.realEstateRepository.delete(id);
  }
}
