import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeDashboardResolver } from './employee-dashboard.resolver';
import { EmployeeDashboardService } from './employee-dashboard.service';

describe('EmployeeDashboardResolver', () => {
  let resolver: EmployeeDashboardResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmployeeDashboardResolver, EmployeeDashboardService],
    }).compile();

    resolver = module.get<EmployeeDashboardResolver>(EmployeeDashboardResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
