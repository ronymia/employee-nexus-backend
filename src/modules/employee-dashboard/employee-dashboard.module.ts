import { Module } from '@nestjs/common';
import { EmployeeDashboardService } from './employee-dashboard.service';
import { EmployeeDashboardResolver } from './employee-dashboard.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [EmployeeDashboardResolver, EmployeeDashboardService],
})
export class EmployeeDashboardModule {}
