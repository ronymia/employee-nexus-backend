import { Test, TestingModule } from '@nestjs/testing';
import { BusinessSubscriptionsService } from './business-subscriptions.service';

describe('BusinessSubscriptionsService', () => {
  let service: BusinessSubscriptionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BusinessSubscriptionsService],
    }).compile();

    service = module.get<BusinessSubscriptionsService>(
      BusinessSubscriptionsService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
