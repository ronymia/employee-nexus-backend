import { Test, TestingModule } from '@nestjs/testing';
import { AttendanceSettingsService } from './attendance-settings.service';

describe('AttendanceSettingsService', () => {
  let service: AttendanceSettingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AttendanceSettingsService],
    }).compile();

    service = module.get<AttendanceSettingsService>(AttendanceSettingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
