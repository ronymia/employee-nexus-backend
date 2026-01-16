import { Module } from '@nestjs/common';
import { EmployeeDepartmentsService } from './employee-departments.service';
import { EmployeeDepartmentsResolver } from './employee-departments.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [EmployeeDepartmentsResolver, EmployeeDepartmentsService],
})
export class EmployeeDepartmentsModule {}
