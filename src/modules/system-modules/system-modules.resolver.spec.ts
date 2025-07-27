import { Test, TestingModule } from '@nestjs/testing';
import { SystemModulesResolver } from './system-modules.resolver';
import { SystemModulesService } from './system-modules.service';

describe('SystemModulesResolver', () => {
  let resolver: SystemModulesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SystemModulesResolver, SystemModulesService],
    }).compile();

    resolver = module.get<SystemModulesResolver>(SystemModulesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
