import { Test, TestingModule } from '@nestjs/testing';
import { ServicePlanModulesService } from './service-plan-modules.service';

describe('ServicePlanModulesService', () => {
  let service: ServicePlanModulesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServicePlanModulesService],
    }).compile();

    service = module.get<ServicePlanModulesService>(ServicePlanModulesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
