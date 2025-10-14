import { Injectable } from '@nestjs/common';
import * as os from 'os';

@Injectable()
export class AppService {
  getStatus() {
    return {
      project: 'Дежурка API',
      version: '1.0.0',
      description: 'Система управления недвижимостью для агентства',
      uptime: `${process.uptime().toFixed(0)} сек.`,
      server: os.hostname(),
      date: new Date().toISOString(),
    };
  }
}
