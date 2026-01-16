import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeEmploymentStatusesResolver } from './employee-employment-statuses.resolver';
import { EmployeeEmploymentStatusesService } from './employee-employment-statuses.service';

describe('EmployeeEmploymentStatusesResolver', () => {
  let resolver: EmployeeEmploymentStatusesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeeEmploymentStatusesResolver,
        EmployeeEmploymentStatusesService,
      ],
    }).compile();

    resolver = module.get<EmployeeEmploymentStatusesResolver>(
      EmployeeEmploymentStatusesResolver,
    );
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
