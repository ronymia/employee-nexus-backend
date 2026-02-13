import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';

async function bootstrap() {
  // CREATE APP
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: new ConsoleLogger({
      json: true,
    }),
  });

  // GLOBAL EXCEPTION FILTER
  app.useGlobalFilters(new AllExceptionsFilter());

  // GLOBAL VALIDATION PIPE (GraphQL-compatible)
  // app.useGlobalPipes(new ValidationPipe());

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
