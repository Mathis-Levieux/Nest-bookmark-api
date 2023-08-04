import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, })) // Sert à utiliser le pipe de validation de NestJS globalement (les dto)
  await app.listen(3001);
}
bootstrap();
