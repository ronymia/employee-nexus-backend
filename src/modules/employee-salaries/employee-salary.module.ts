import { Module } from '@nestjs/common';
import { EmployeeSalariesService } from './employee-salary.service';
import { EmployeeSalariesResolver } from './employee-salary.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [EmployeeSalariesResolver, EmployeeSalariesService],
  exports: [EmployeeSalariesService],
})
export class EmployeeSalariesModule {}
