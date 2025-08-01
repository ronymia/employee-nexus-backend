import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionPlansResolver } from './subscription-plans.resolver';
import { SubscriptionPlansService } from './subscription-plans.service';

describe('SubscriptionPlansResolver', () => {
  let resolver: SubscriptionPlansResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubscriptionPlansResolver, SubscriptionPlansService],
    }).compile();

    resolver = module.get<SubscriptionPlansResolver>(SubscriptionPlansResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
