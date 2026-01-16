import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeDepartmentsResolver } from './employee-departments.resolver';
import { EmployeeDepartmentsService } from './employee-departments.service';

describe('EmployeeDepartmentsResolver', () => {
  let resolver: EmployeeDepartmentsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmployeeDepartmentsResolver, EmployeeDepartmentsService],
    }).compile();

    resolver = module.get<EmployeeDepartmentsResolver>(
      EmployeeDepartmentsResolver,
    );
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
