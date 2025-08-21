import { Test, TestingModule } from '@nestjs/testing';
import { JobTypesResolver } from './job-types.resolver';
import { JobTypesService } from './job-types.service';

describe('JobTypesResolver', () => {
  let resolver: JobTypesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JobTypesResolver, JobTypesService],
    }).compile();

    resolver = module.get<JobTypesResolver>(JobTypesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
