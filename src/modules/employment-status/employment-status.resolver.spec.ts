import { Test, TestingModule } from '@nestjs/testing';
import { EmploymentStatusResolver } from './employment-status.resolver';
import { EmploymentStatusService } from './employment-status.service';

describe('EmploymentStatusResolver', () => {
  let resolver: EmploymentStatusResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmploymentStatusResolver, EmploymentStatusService],
    }).compile();

    resolver = module.get<EmploymentStatusResolver>(EmploymentStatusResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
