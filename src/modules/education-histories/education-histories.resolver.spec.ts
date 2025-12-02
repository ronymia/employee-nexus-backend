import { Test, TestingModule } from '@nestjs/testing';
import { EducationHistoriesResolver } from './education-histories.resolver';
import { EducationHistoriesService } from './education-histories.service';

describe('EducationHistoriesResolver', () => {
  let resolver: EducationHistoriesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EducationHistoriesResolver, EducationHistoriesService],
    }).compile();

    resolver = module.get<EducationHistoriesResolver>(
      EducationHistoriesResolver,
    );
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
