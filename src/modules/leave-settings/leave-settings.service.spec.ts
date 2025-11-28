import { Test, TestingModule } from '@nestjs/testing';
import { LeaveSettingsService } from './leave-settings.service';

describe('LeaveSettingsService', () => {
  let service: LeaveSettingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LeaveSettingsService],
    }).compile();

    service = module.get<LeaveSettingsService>(LeaveSettingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
