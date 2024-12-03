import { Injectable } from '@nestjs/common';
import { CreateHeatingDto } from './dto/create-heating.dto';
import { UpdateHeatingDto } from './dto/update-heating.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Heating } from './entities/heating.entity';
import { Repository } from 'typeorm';

@Injectable()
export class HeatingService {
  constructor(
    @InjectRepository(Heating)
    private heatingRepository: Repository<Heating>,
  ) {}

  findAll() {
    return this.heatingRepository.find();
  }

  create(name: string) {
    const repair = this.heatingRepository.create({ name });
    return this.heatingRepository.save(repair);
  }
}
