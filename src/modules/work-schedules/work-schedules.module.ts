import { Module } from '@nestjs/common';
import { WorkSchedulesService } from './work-schedules.service';
import { WorkSchedulesResolver } from './work-schedules.resolver';

@Module({
  providers: [WorkSchedulesResolver, WorkSchedulesService],
})
export class WorkSchedulesModule {}
