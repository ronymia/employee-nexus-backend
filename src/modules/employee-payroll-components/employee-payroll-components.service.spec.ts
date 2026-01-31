import { Test, TestingModule } from '@nestjs/testing';
import { EmployeePayrollComponentsService } from './employee-payroll-components.service';

describe('EmployeePayrollComponentsService', () => {
  let service: EmployeePayrollComponentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmployeePayrollComponentsService],
    }).compile();

    service = module.get<EmployeePayrollComponentsService>(
      EmployeePayrollComponentsService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
