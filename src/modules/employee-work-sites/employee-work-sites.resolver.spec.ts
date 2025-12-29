import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeWorkSitesResolver } from './employee-work-sites.resolver';
import { EmployeeWorkSitesService } from './employee-work-sites.service';

describe('EmployeeWorkSitesResolver', () => {
  let resolver: EmployeeWorkSitesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmployeeWorkSitesResolver, EmployeeWorkSitesService],
    }).compile();

    resolver = module.get<EmployeeWorkSitesResolver>(EmployeeWorkSitesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
