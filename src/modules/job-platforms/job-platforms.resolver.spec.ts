import { Test, TestingModule } from '@nestjs/testing';
import { JobPlatformsResolver } from './job-platforms.resolver';
import { JobPlatformsService } from './job-platforms.service';

describe('JobPlatformsResolver', () => {
  let resolver: JobPlatformsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JobPlatformsResolver, JobPlatformsService],
    }).compile();

    resolver = module.get<JobPlatformsResolver>(JobPlatformsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
