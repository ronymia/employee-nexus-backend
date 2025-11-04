import { Module } from '@nestjs/common';
import { BusinessSchedulesService } from './business-schedules.service';
import { BusinessSchedulesResolver } from './business-schedules.resolver';

@Module({
  providers: [BusinessSchedulesResolver, BusinessSchedulesService],
})
export class BusinessSchedulesModule {}
