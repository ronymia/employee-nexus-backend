import { Test, TestingModule } from '@nestjs/testing';
import { AttendanceSettingsResolver } from './attendance-settings.resolver';
import { AttendanceSettingsService } from './attendance-settings.service';

describe('AttendanceSettingsResolver', () => {
  let resolver: AttendanceSettingsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AttendanceSettingsResolver, AttendanceSettingsService],
    }).compile();

    resolver = module.get<AttendanceSettingsResolver>(
      AttendanceSettingsResolver,
    );
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
