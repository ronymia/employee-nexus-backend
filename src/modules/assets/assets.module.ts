import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { AssetsService } from './assets.service';
import { AssetsResolver } from './assets.resolver';
import { AssetsController } from './assets.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    MulterModule.register({
      dest: './uploads/assets',
    }),
  ],
  controllers: [AssetsController],
  providers: [AssetsResolver, AssetsService],
  exports: [AssetsService],
})
export class AssetsModule {}
