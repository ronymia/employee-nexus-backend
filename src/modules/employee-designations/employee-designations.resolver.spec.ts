import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeDesignationsResolver } from './employee-designations.resolver';
import { EmployeeDesignationsService } from './employee-designations.service';

describe('EmployeeDesignationsResolver', () => {
  let resolver: EmployeeDesignationsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmployeeDesignationsResolver, EmployeeDesignationsService],
    }).compile();

    resolver = module.get<EmployeeDesignationsResolver>(
      EmployeeDesignationsResolver,
    );
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
