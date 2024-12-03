// src/repair/repair.service.ts
import { Injectable } from '@nestjs/common';
import { CreateRepairDto } from './dto/create-repair.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repair } from './entities/repair.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RepairService {
  constructor(
    @InjectRepository(Repair)
    private repairRepository: Repository<Repair>,
  ) {}

  findAll() {
    return this.repairRepository.find();
  }

  create(name: string) {
    const repair = this.repairRepository.create({ name });
    return this.repairRepository.save(repair);
  }
}
