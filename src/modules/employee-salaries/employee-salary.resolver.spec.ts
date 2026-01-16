import { Test, TestingModule } from '@nestjs/testing';
import { SalariesResolver } from './salaries.resolver';
import { SalariesService } from './salaries.service';

describe('SalariesResolver', () => {
  let resolver: SalariesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SalariesResolver, SalariesService],
    }).compile();

    resolver = module.get<SalariesResolver>(SalariesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
