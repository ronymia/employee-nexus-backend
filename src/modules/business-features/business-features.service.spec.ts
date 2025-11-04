import { Test, TestingModule } from '@nestjs/testing';
import { BusinessFeaturesService } from './business-features.service';

describe('BusinessFeaturesService', () => {
  let service: BusinessFeaturesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BusinessFeaturesService],
    }).compile();

    service = module.get<BusinessFeaturesService>(BusinessFeaturesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
