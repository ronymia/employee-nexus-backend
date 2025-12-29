import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeEmploymentStatusesService } from './employee-employment-statuses.service';

describe('EmployeeEmploymentStatusesService', () => {
  let service: EmployeeEmploymentStatusesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmployeeEmploymentStatusesService],
    }).compile();

    service = module.get<EmployeeEmploymentStatusesService>(
      EmployeeEmploymentStatusesService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
