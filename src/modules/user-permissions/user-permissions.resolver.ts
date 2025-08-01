import { Resolver } from '@nestjs/graphql';
import { UserPermission } from './entities/user-permission.entity';

@Resolver(() => UserPermission)
export class UserPermissionsResolver {
  // constructor(
  //   private readonly userPermissionsService: UserPermissionsService,
  // ) {}
  // @Mutation(() => UserPermission)
  // createUserPermission(
  //   @Args('createUserPermissionInput')
  //   createUserPermissionInput: CreateUserPermissionInput,
  // ) {
  //   return this.userPermissionsService.create(createUserPermissionInput);
  // }
  // @Query(() => [UserPermission], { name: 'userPermissions' })
  // findAll() {
  //   return this.userPermissionsService.findAll();
  // }
  // @Query(() => UserPermission, { name: 'userPermission' })
  // findOne(@Args('id', { type: () => Int }) id: number) {
  //   return this.userPermissionsService.findOne(id);
  // }
  // @Mutation(() => UserPermission)
  // updateUserPermission(
  //   @Args('updateUserPermissionInput')
  //   updateUserPermissionInput: UpdateUserPermissionInput,
  // ) {
  //   return this.userPermissionsService.update(
  //     updateUserPermissionInput.userId,
  //     updateUserPermissionInput,
  //   );
  // }
  // @Mutation(() => UserPermission)
  // removeUserPermission(@Args('id', { type: () => Int }) id: number) {
  //   return this.userPermissionsService.remove(id);
  // }
}
