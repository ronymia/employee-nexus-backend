import { Test, TestingModule } from '@nestjs/testing';
import { BusinessModulesService } from './business-modules.service';

describe('BusinessModulesService', () => {
  let service: BusinessModulesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BusinessModulesService],
    }).compile();

    service = module.get<BusinessModulesService>(BusinessModulesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
