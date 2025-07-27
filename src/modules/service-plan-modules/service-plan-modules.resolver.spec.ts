import { Test, TestingModule } from '@nestjs/testing';
import { ServicePlanModulesResolver } from './service-plan-modules.resolver';
import { ServicePlanModulesService } from './service-plan-modules.service';

describe('ServicePlanModulesResolver', () => {
  let resolver: ServicePlanModulesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServicePlanModulesResolver, ServicePlanModulesService],
    }).compile();

    resolver = module.get<ServicePlanModulesResolver>(
      ServicePlanModulesResolver,
    );
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
