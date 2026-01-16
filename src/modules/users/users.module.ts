import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver, EmployeeResolver } from './users.resolver';
import { PrismaModule } from '../prisma/prisma.module';
import { EmployeeSalariesModule } from '../employee-salaries/employee-salary.module';

@Module({
  imports: [PrismaModule, EmployeeSalariesModule],
  providers: [UsersResolver, EmployeeResolver, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
