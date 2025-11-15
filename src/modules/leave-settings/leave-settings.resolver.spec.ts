import { Test, TestingModule } from '@nestjs/testing';
import { LeaveSettingsResolver } from './leave-settings.resolver';
import { LeaveSettingsService } from './leave-settings.service';

describe('LeaveSettingsResolver', () => {
  let resolver: LeaveSettingsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LeaveSettingsResolver, LeaveSettingsService],
    }).compile();

    resolver = module.get<LeaveSettingsResolver>(LeaveSettingsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
