import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionFeaturesService } from './subscription-features.service';

describe('SubscriptionFeaturesService', () => {
  let service: SubscriptionFeaturesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubscriptionFeaturesService],
    }).compile();

    service = module.get<SubscriptionFeaturesService>(
      SubscriptionFeaturesService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
