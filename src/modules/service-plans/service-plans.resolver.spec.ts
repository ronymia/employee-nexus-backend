import { Test, TestingModule } from '@nestjs/testing';
import { ServicePlansResolver } from './service-plans.resolver';
import { ServicePlansService } from './service-plans.service';

describe('ServicePlansResolver', () => {
  let resolver: ServicePlansResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServicePlansResolver, ServicePlansService],
    }).compile();

    resolver = module.get<ServicePlansResolver>(ServicePlansResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
