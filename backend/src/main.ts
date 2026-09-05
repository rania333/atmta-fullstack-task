import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  // Enable CORS
  app.enableCors({
    origin: configService.get<string>('FRONTEND_URL'),
    credentials: true,
  });

  // Enable ValidationPipe globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Ignore not exist props in the request body
      transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3001);
}
await bootstrap();
