import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeWorkSchedulesResolver } from './employee-work-schedules.resolver';
import { EmployeeWorkSchedulesService } from './employee-work-schedules.service';

describe('EmployeeWorkSchedulesResolver', () => {
  let resolver: EmployeeWorkSchedulesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmployeeWorkSchedulesResolver, EmployeeWorkSchedulesService],
    }).compile();

    resolver = module.get<EmployeeWorkSchedulesResolver>(
      EmployeeWorkSchedulesResolver,
    );
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
