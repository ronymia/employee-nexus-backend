import { Module } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { AssetsResolver } from './assets.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [AssetsResolver, AssetsService],
  exports: [AssetsService],
})
export class AssetsModule {}
