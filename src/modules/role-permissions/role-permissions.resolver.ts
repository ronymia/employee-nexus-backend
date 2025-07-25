import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { RolePermissionsService } from './role-permissions.service';
import { RolePermission } from './entities/role-permission.entity';
import { CreateRolePermissionInput } from './dto/create-role-permission.input';
import { UpdateRolePermissionInput } from './dto/update-role-permission.input';

@Resolver(() => RolePermission)
export class RolePermissionsResolver {
  constructor(
    private readonly rolePermissionsService: RolePermissionsService,
  ) {}

  @Mutation(() => RolePermission)
  createRolePermission(
    @Args('createRolePermissionInput')
    createRolePermissionInput: CreateRolePermissionInput,
  ) {
    return this.rolePermissionsService.create(createRolePermissionInput);
  }

  @Query(() => [RolePermission], { name: 'rolePermissions' })
  findAll() {
    return this.rolePermissionsService.findAll();
  }

  @Query(() => RolePermission, { name: 'rolePermission' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.rolePermissionsService.findOne(id);
  }

  @Mutation(() => RolePermission)
  updateRolePermission(
    @Args('updateRolePermissionInput')
    updateRolePermissionInput: UpdateRolePermissionInput,
  ) {
    return this.rolePermissionsService.update(
      updateRolePermissionInput.permissionId,
      updateRolePermissionInput,
    );
  }

  @Mutation(() => RolePermission)
  removeRolePermission(@Args('id', { type: () => Int }) id: number) {
    return this.rolePermissionsService.remove(id);
  }
}
