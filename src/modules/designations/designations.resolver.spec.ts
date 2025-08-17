import { Test, TestingModule } from '@nestjs/testing';
import { DesignationsResolver } from './designations.resolver';
import { DesignationsService } from './designations.service';

describe('DesignationsResolver', () => {
  let resolver: DesignationsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DesignationsResolver, DesignationsService],
    }).compile();

    resolver = module.get<DesignationsResolver>(DesignationsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
