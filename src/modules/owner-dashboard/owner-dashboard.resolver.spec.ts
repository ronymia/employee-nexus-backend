import { Test, TestingModule } from '@nestjs/testing';
import { OwnerDashboardResolver } from './owner-dashboard.resolver';
import { OwnerDashboardService } from './owner-dashboard.service';

describe('OwnerDashboardResolver', () => {
  let resolver: OwnerDashboardResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OwnerDashboardResolver, OwnerDashboardService],
    }).compile();

    resolver = module.get<OwnerDashboardResolver>(OwnerDashboardResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
