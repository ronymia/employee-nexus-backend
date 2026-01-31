import { Test, TestingModule } from '@nestjs/testing';
import { EmployeePayslipAdjustmentsService } from './employee-payslip-adjustments.service';

describe('EmployeePayslipAdjustmentsService', () => {
  let service: EmployeePayslipAdjustmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmployeePayslipAdjustmentsService],
    }).compile();

    service = module.get<EmployeePayslipAdjustmentsService>(
      EmployeePayslipAdjustmentsService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
