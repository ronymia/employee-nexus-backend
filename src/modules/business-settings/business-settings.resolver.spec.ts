import { Test, TestingModule } from '@nestjs/testing';
import { BusinessSettingsResolver } from './business-settings.resolver';
import { BusinessSettingsService } from './business-settings.service';

describe('BusinessSettingsResolver', () => {
  let resolver: BusinessSettingsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BusinessSettingsResolver, BusinessSettingsService],
    }).compile();

    resolver = module.get<BusinessSettingsResolver>(BusinessSettingsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
