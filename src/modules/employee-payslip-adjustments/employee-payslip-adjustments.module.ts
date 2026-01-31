import { Module } from '@nestjs/common';
import { EmployeePayslipAdjustmentsService } from './employee-payslip-adjustments.service';
import { EmployeePayslipAdjustmentsResolver } from './employee-payslip-adjustments.resolver';

@Module({
  providers: [
    EmployeePayslipAdjustmentsResolver,
    EmployeePayslipAdjustmentsService,
  ],
})
export class EmployeePayslipAdjustmentsModule {}
