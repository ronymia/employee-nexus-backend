import { Test, TestingModule } from '@nestjs/testing';
import { JobPlatformsService } from './job-platforms.service';

describe('JobPlatformsService', () => {
  let service: JobPlatformsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JobPlatformsService],
    }).compile();

    service = module.get<JobPlatformsService>(JobPlatformsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
