import { Module } from '@nestjs/common';
import { EmployeeScheduleAssignmentsService } from './employee-schedule-assignments.service';
import { EmployeeScheduleAssignmentsResolver } from './employee-schedule-assignments.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [
    EmployeeScheduleAssignmentsResolver,
    EmployeeScheduleAssignmentsService,
  ],
  exports: [EmployeeScheduleAssignmentsService],
})
export class EmployeeScheduleAssignmentsModule {}
