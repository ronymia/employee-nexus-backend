import { Module } from '@nestjs/common';
import { EmployeePayrollComponentsService } from './employee-payroll-components.service';
import { EmployeePayrollComponentsResolver } from './employee-payroll-components.resolver';

@Module({
  providers: [
    EmployeePayrollComponentsResolver,
    EmployeePayrollComponentsService,
  ],
})
export class EmployeePayrollComponentsModule {}
