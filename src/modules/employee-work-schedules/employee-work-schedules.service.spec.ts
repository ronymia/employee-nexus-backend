import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeWorkSchedulesService } from './employee-work-schedules.service';

describe('EmployeeWorkSchedulesService', () => {
  let service: EmployeeWorkSchedulesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmployeeWorkSchedulesService],
    }).compile();

    service = module.get<EmployeeWorkSchedulesService>(
      EmployeeWorkSchedulesService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
