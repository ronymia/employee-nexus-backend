import { Resolver } from '@nestjs/graphql';
import { Role } from './entities/role.entity';

@Resolver(() => Role)
export class RolesResolver {
  // constructor(private readonly rolesService: RolesService) {}
  // @Mutation(() => Role)
  // createRole(@Args('createRoleInput') createRoleInput: CreateRoleInput) {
  //   return this.rolesService.create(createRoleInput);
  // }
  // @Query(() => [Role], { name: 'roles' })
  // findAll() {
  //   return this.rolesService.findAll();
  // }
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
