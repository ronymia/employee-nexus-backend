import { Test, TestingModule } from '@nestjs/testing';
import { AssetTypesResolver } from './asset-types.resolver';
import { AssetTypesService } from './asset-types.service';

describe('AssetTypesResolver', () => {
  let resolver: AssetTypesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AssetTypesResolver, AssetTypesService],
    }).compile();

    resolver = module.get<AssetTypesResolver>(AssetTypesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
