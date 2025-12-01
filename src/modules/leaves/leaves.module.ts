import { Module } from '@nestjs/common';
import { LeavesService } from './leaves.service';
import { LeavesResolver } from './leaves.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [LeavesResolver, LeavesService],
})
export class LeavesModule {}
