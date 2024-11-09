// src/sales/sales.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSaleDto } from './dto/create-sale.dto';
import { Sale } from './entities/sale.entity';
import { User } from 'src/users/entities/user.entity';
import { RealEstate } from 'src/real-estate/entities/real-estate.entity';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale)
    private salesRepository: Repository<Sale>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(RealEstate)
    private realEstateRepository: Repository<RealEstate>,
  ) {}

  findAll(): Promise<Sale[]> {
    return this.salesRepository.find({ relations: ['user', 'realEstate'] });
  }

  findOne(id: number): Promise<Sale> {
    return this.salesRepository.findOne({
      where: { id },
      relations: ['user', 'realEstate'],
    });
  }

  async create(createSaleDto: CreateSaleDto): Promise<Sale> {
    // Находим пользователя и недвижимость по ID из DTO
    const user = await this.usersRepository.findOneBy({
      id: createSaleDto.userId,
    });
    const realEstate = await this.realEstateRepository.findOneBy({
      id: createSaleDto.realEstateId,
    });

    if (!user || !realEstate) {
      throw new Error('User or Real Estate not found');
    }

    const sale = this.salesRepository.create({
      saleDate: createSaleDto.saleDate,
      user, // Указываем найденного пользователя
      realEstate, // Указываем найденную недвижимость
    });

    return this.salesRepository.save(sale);
  }

  async remove(id: number): Promise<void> {
    await this.salesRepository.delete(id);
  }
}
