import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionFeaturesResolver } from './subscription-features.resolver';
import { SubscriptionFeaturesService } from './subscription-features.service';

describe('SubscriptionFeaturesResolver', () => {
  let resolver: SubscriptionFeaturesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubscriptionFeaturesResolver, SubscriptionFeaturesService],
    }).compile();

    resolver = module.get<SubscriptionFeaturesResolver>(
      SubscriptionFeaturesResolver,
    );
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
