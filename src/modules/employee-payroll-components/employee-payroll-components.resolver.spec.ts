import { Test, TestingModule } from '@nestjs/testing';
import { EmployeePayrollComponentsResolver } from './employee-payroll-components.resolver';
import { EmployeePayrollComponentsService } from './employee-payroll-components.service';

describe('EmployeePayrollComponentsResolver', () => {
  let resolver: EmployeePayrollComponentsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeePayrollComponentsResolver,
        EmployeePayrollComponentsService,
      ],
    }).compile();

    resolver = module.get<EmployeePayrollComponentsResolver>(
      EmployeePayrollComponentsResolver,
    );
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
