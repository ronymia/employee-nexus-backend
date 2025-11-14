import { Test, TestingModule } from '@nestjs/testing';
import { RecruitmentProcessesResolver } from './recruitment-processes.resolver';
import { RecruitmentProcessesService } from './recruitment-processes.service';

describe('RecruitmentProcessesResolver', () => {
  let resolver: RecruitmentProcessesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecruitmentProcessesResolver, RecruitmentProcessesService],
    }).compile();

    resolver = module.get<RecruitmentProcessesResolver>(
      RecruitmentProcessesResolver,
    );
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
