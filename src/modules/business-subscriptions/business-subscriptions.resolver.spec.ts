import { Test, TestingModule } from '@nestjs/testing';
import { BusinessSubscriptionsResolver } from './business-subscriptions.resolver';
import { BusinessSubscriptionsService } from './business-subscriptions.service';

describe('BusinessSubscriptionsResolver', () => {
  let resolver: BusinessSubscriptionsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BusinessSubscriptionsResolver, BusinessSubscriptionsService],
    }).compile();

    resolver = module.get<BusinessSubscriptionsResolver>(
      BusinessSubscriptionsResolver,
    );
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
