import { Test, TestingModule } from '@nestjs/testing';
import { WorkSitesService } from './work-sites.service';

describe('WorkSitesService', () => {
  let service: WorkSitesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkSitesService],
    }).compile();

    service = module.get<WorkSitesService>(WorkSitesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
