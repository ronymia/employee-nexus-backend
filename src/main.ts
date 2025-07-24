import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { seedSuperAdmin } from './Database';

async function bootstrap() {
  // CREATE APP
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      json: true,
    }),
  });

  // ENABLE CORS
  app.enableCors();

  // PARSE COOKIES
  app.use(cookieParser());

  // START SERVER
  await app.listen(process.env.PORT ?? 3000);

  // SEED DATABASE
  await seedSuperAdmin();
}
bootstrap();
