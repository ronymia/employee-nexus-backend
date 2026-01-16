import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeWorkSitesService } from './employee-work-sites.service';

describe('EmployeeWorkSitesService', () => {
  let service: EmployeeWorkSitesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmployeeWorkSitesService],
    }).compile();

    service = module.get<EmployeeWorkSitesService>(EmployeeWorkSitesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
