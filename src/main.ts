import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
// import { HttpExceptionFilter } from './common/filters/http-exception.filter';
// import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new AllExceptionsFilter());
  app.enableCors();

  // CORS
  app.enableCors({
    origin: '*', // можно указать конкретные фронтенды
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Дежурка API')
    .setDescription('API для системы управления недвижимостью')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT || 3000);
  console.log(
    `🚀 Server running on http://localhost:${process.env.PORT || 3000}`,
  );
}

bootstrap();
