import { Test, TestingModule } from '@nestjs/testing';
import { LeaveTypesResolver } from './leave-types.resolver';
import { LeaveTypesService } from './leave-types.service';

describe('LeaveTypesResolver', () => {
  let resolver: LeaveTypesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LeaveTypesResolver, LeaveTypesService],
    }).compile();

    resolver = module.get<LeaveTypesResolver>(LeaveTypesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
