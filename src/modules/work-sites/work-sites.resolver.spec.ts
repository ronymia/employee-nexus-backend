import { Test, TestingModule } from '@nestjs/testing';
import { WorkSitesResolver } from './work-sites.resolver';
import { WorkSitesService } from './work-sites.service';

describe('WorkSitesResolver', () => {
  let resolver: WorkSitesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkSitesResolver, WorkSitesService],
    }).compile();

    resolver = module.get<WorkSitesResolver>(WorkSitesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
