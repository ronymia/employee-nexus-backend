import { Test, TestingModule } from '@nestjs/testing';
import { EmployeePayslipAdjustmentsResolver } from './employee-payslip-adjustments.resolver';
import { EmployeePayslipAdjustmentsService } from './employee-payslip-adjustments.service';

describe('EmployeePayslipAdjustmentsResolver', () => {
  let resolver: EmployeePayslipAdjustmentsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeePayslipAdjustmentsResolver,
        EmployeePayslipAdjustmentsService,
      ],
    }).compile();

    resolver = module.get<EmployeePayslipAdjustmentsResolver>(
      EmployeePayslipAdjustmentsResolver,
    );
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
