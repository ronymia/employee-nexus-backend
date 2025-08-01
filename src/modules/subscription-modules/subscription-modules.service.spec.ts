import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionModulesService } from './subscription-modules.service';

describe('SubscriptionModulesService', () => {
  let service: SubscriptionModulesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubscriptionModulesService],
    }).compile();

    service = module.get<SubscriptionModulesService>(SubscriptionModulesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
