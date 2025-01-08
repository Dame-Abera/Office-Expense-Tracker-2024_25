import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { validate } from 'class-validator';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist:true,
      forbidNonWhitelisted: true,
    }),
  );
  app.enableCors({
    origin: 'http://127.0.0.1:3000', // Allow specific origin
    methods: 'GET,POST,PATCH,DELETE', // Allow specific methods
    credentials: true, // Allow cookies if necessary
  });
  const port = process.env.PORT ?? 3333;
 
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
