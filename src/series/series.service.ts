// src/series/series.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSeriesDto } from './dto/create-series.dto';
import { Series } from 'src/real-estate/entities/series.entity';

@Injectable()
export class SeriesService {
  constructor(
    @InjectRepository(Series)
    private seriesRepository: Repository<Series>,
  ) {}

  findAll(): Promise<Series[]> {
    return this.seriesRepository.find();
  }

  findOne(id): Promise<Series> {
    return this.seriesRepository.findOne({ where: id });
  }

  create(createSeriesDto: CreateSeriesDto): Promise<Series> {
    const series = this.seriesRepository.create(createSeriesDto);
    return this.seriesRepository.save(series);
  }

  async remove(id: number): Promise<void> {
    await this.seriesRepository.delete(id);
  }
}
