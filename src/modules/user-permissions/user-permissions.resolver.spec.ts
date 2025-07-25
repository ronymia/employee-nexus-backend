import { Test, TestingModule } from '@nestjs/testing';
import { UserPermissionsResolver } from './user-permissions.resolver';
import { UserPermissionsService } from './user-permissions.service';

describe('UserPermissionsResolver', () => {
  let resolver: UserPermissionsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserPermissionsResolver, UserPermissionsService],
    }).compile();

    resolver = module.get<UserPermissionsResolver>(UserPermissionsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
