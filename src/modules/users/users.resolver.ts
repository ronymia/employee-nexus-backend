import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { PermissionUtils } from 'src/utils/permission.utils';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @ResolveField(() => [String], {
    nullable: true,
    description: 'Formatted permissions as ["Resource:action"]',
  })
  permissions(@Parent() user: User): string[] {
    return PermissionUtils.formatUserPermissions(user as any);
  }

  @Mutation(() => User)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.usersService.create(createUserInput);
  }

  @Query(() => [User], { name: 'users' })
  users() {
    return this.usersService.findAll();
  }

  @Query(() => User, { name: 'userById' })
  userById(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.findOne(id);
  }

  // @Mutation(() => User)
  // updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
  //   return this.usersService.update(updateUserInput.id, updateUserInput);
  // }

  @Mutation(() => User)
  deleteUser(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.remove(id);
  }
}
