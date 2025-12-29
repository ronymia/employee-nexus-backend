import { Module } from '@nestjs/common';
import { EmployeeWorkSchedulesService } from './employee-work-schedules.service';
import { EmployeeWorkSchedulesResolver } from './employee-work-schedules.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [EmployeeWorkSchedulesResolver, EmployeeWorkSchedulesService],
})
export class EmployeeWorkSchedulesModule {}
