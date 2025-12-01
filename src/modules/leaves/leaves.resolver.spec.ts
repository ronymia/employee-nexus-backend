import { Test, TestingModule } from '@nestjs/testing';
import { LeavesResolver } from './leaves.resolver';
import { LeavesService } from './leaves.service';

describe('LeavesResolver', () => {
  let resolver: LeavesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LeavesResolver, LeavesService],
    }).compile();

    resolver = module.get<LeavesResolver>(LeavesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
