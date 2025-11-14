import { Module } from '@nestjs/common';
import { RecruitmentProcessesService } from './recruitment-processes.service';
import { RecruitmentProcessesResolver } from './recruitment-processes.resolver';

@Module({
  providers: [RecruitmentProcessesResolver, RecruitmentProcessesService],
})
export class RecruitmentProcessesModule {}
