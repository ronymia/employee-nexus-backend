import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { Permission } from './entities/permission.entity';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { PermissionsGuard } from './guards/permission.guard';
import { RequirePermissions } from './decorators/permissions.decorator';

@Resolver(() => Permission)
@UseGuards(GqlAuthGuard, PermissionsGuard)
export class PermissionsResolver {
  constructor(private readonly permissionsService: PermissionsService) {}

  // @Mutation(() => Permission)
  // createPermission(
  //   @Args('createPermissionInput') createPermissionInput: CreatePermissionInput,
  // ) {
  //   return this.permissionsService.create(createPermissionInput);
  // }

  @Query(() => [Permission], { name: 'permissions' })
  @RequirePermissions('Permission:read')
  findAll() {
    return this.permissionsService.findAll();
  }

  @Query(() => Permission, { name: 'permissionById' })
  @RequirePermissions('Permission:read')
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.permissionsService.findOne(id);
  }

  // @Mutation(() => Permission)
  // updatePermission(
  //   @Args('updatePermissionInput') updatePermissionInput: UpdatePermissionInput,
  // ) {
  //   return this.permissionsService.update(
  //     updatePermissionInput.id,
  //     updatePermissionInput,
  //   );
  // }

  // @Mutation(() => Permission)
  // removePermission(@Args('id', { type: () => Int }) id: number) {
  //   return this.permissionsService.remove(id);
  // }
}
