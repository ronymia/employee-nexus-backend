import { Test, TestingModule } from '@nestjs/testing';
import { BusinessModulesResolver } from './business-modules.resolver';
import { BusinessModulesService } from './business-modules.service';

describe('BusinessModulesResolver', () => {
  let resolver: BusinessModulesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BusinessModulesResolver, BusinessModulesService],
    }).compile();

    resolver = module.get<BusinessModulesResolver>(BusinessModulesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
