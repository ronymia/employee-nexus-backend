import { Module } from '@nestjs/common';
import { EmployeeEmploymentStatusesService } from './employee-employment-statuses.service';
import { EmployeeEmploymentStatusesResolver } from './employee-employment-statuses.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [
    EmployeeEmploymentStatusesResolver,
    EmployeeEmploymentStatusesService,
  ],
})
export class EmployeeEmploymentStatusesModule {}
