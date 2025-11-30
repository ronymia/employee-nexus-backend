import { Module } from '@nestjs/common';
import { JobHistoriesService } from './job-histories.service';
import { JobHistoriesResolver } from './job-histories.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [JobHistoriesResolver, JobHistoriesService],
  exports: [JobHistoriesService],
})
export class JobHistoriesModule {}
