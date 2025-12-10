import { Test, TestingModule } from '@nestjs/testing';
import { OwnerDashboardService } from './owner-dashboard.service';

describe('OwnerDashboardService', () => {
  let service: OwnerDashboardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OwnerDashboardService],
    }).compile();

    service = module.get<OwnerDashboardService>(OwnerDashboardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
