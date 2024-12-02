import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path'
import { mkdirSync, existsSync } from 'fs';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:5173',
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    credentials: true,
  });
  app.use('/upload', express.static(join(__dirname, '..', 'upload')));
  const uploadDir = join(process.cwd(), 'uploads')

  if(!existsSync(uploadDir)) {
    mkdirSync(uploadDir)
  }

  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
