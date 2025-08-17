import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionModulesResolver } from './subscription-modules.resolver';
import { SubscriptionModulesService } from './subscription-modules.service';

describe('SubscriptionModulesResolver', () => {
  let resolver: SubscriptionModulesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubscriptionModulesResolver, SubscriptionModulesService],
    }).compile();

    resolver = module.get<SubscriptionModulesResolver>(
      SubscriptionModulesResolver,
    );
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
