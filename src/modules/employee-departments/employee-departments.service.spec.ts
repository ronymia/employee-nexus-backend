import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeDepartmentsService } from './employee-departments.service';

describe('EmployeeDepartmentsService', () => {
  let service: EmployeeDepartmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmployeeDepartmentsService],
    }).compile();

    service = module.get<EmployeeDepartmentsService>(
      EmployeeDepartmentsService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
