import { Test, TestingModule } from '@nestjs/testing';
import { BusinessFeaturesResolver } from './business-features.resolver';
import { BusinessFeaturesService } from './business-features.service';

describe('BusinessFeaturesResolver', () => {
  let resolver: BusinessFeaturesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BusinessFeaturesResolver, BusinessFeaturesService],
    }).compile();

    resolver = module.get<BusinessFeaturesResolver>(BusinessFeaturesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
