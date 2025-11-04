import { Test, TestingModule } from '@nestjs/testing';
import { BusinessSchedulesService } from './business-schedules.service';

describe('BusinessSchedulesService', () => {
  let service: BusinessSchedulesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BusinessSchedulesService],
    }).compile();

    service = module.get<BusinessSchedulesService>(BusinessSchedulesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
