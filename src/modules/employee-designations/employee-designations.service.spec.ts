import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeDesignationsService } from './employee-designations.service';

describe('EmployeeDesignationsService', () => {
  let service: EmployeeDesignationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmployeeDesignationsService],
    }).compile();

    service = module.get<EmployeeDesignationsService>(
      EmployeeDesignationsService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
