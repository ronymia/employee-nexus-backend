import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  // CREATE APP
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: new ConsoleLogger({
      json: true,
    }),
  });

  // ENABLE CORS
  app.enableCors();

  // PARSE COOKIES
  app.use(cookieParser());

  // SERVE STATIC FILES
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // START SERVER
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
