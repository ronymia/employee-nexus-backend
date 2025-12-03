import { Query, Resolver } from '@nestjs/graphql';
import { Role, RoleResponse } from './entities/role.entity';
import { JwtPayload } from '../auth/jwt.strategy';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { HttpStatus, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { PermissionsGuard } from '../permissions/guards/permission.guard';
import { RequirePermissions } from '../permissions/decorators/permissions.decorator';
import { RolesService } from './roles.service';

@Resolver(() => Role)
@UseGuards(GqlAuthGuard, PermissionsGuard)
export class RolesResolver {
  constructor(private readonly rolesService: RolesService) {}
  // @Mutation(() => Role)
  // createRole(@Args('createRoleInput') createRoleInput: CreateRoleInput) {
  //   return this.rolesService.create(createRoleInput);
  // }
  @Query(() => RoleResponse, { name: 'roles' })
  @RequirePermissions('Role:read')
  async findAll(@CurrentUser() user: JwtPayload) {
    const result = await this.rolesService.findAll(user);

    // RESPONSE FORMAT
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Roles retrieved successfully',
      data: result,
    };
  }
  // @Query(() => Role, { name: 'role' })
  // findOne(@Args('id', { type: () => Int }) id: number) {
  //   return this.rolesService.findOne(id);
  // }
  // @Mutation(() => Role)
  // updateRole(@Args('updateRoleInput') updateRoleInput: UpdateRoleInput) {
  //   return this.rolesService.update(updateRoleInput.id, updateRoleInput);
  // }
  // @Mutation(() => Role)
  // removeRole(@Args('id', { type: () => Int }) id: number) {
  //   return this.rolesService.remove(id);
  // }
}
