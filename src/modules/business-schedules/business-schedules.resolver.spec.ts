import { Test, TestingModule } from '@nestjs/testing';
import { BusinessSchedulesResolver } from './business-schedules.resolver';
import { BusinessSchedulesService } from './business-schedules.service';

describe('BusinessSchedulesResolver', () => {
  let resolver: BusinessSchedulesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BusinessSchedulesResolver, BusinessSchedulesService],
    }).compile();

    resolver = module.get<BusinessSchedulesResolver>(BusinessSchedulesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
