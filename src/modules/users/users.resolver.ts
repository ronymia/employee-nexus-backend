import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { HttpStatus, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User, UserResponse, UsersQueryResponse } from './entities/user.entity';
import { CreateEmployeeInput } from './dto/create-employee.input';
import { UpdateEmployeeInput } from './dto/update-employee.input';
import { QueryUserInput } from './dto/query-user.input';
import { PermissionUtils } from 'src/utils/permission.utils';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/jwt.strategy';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @ResolveField(() => [String], {
    nullable: true,
    description: 'Formatted permissions as ["Resource:action"]',
  })
  permissions(@Parent() user: User): string[] {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return PermissionUtils.formatUserPermissions(user as any);
  }

  // @Mutation(() => User)
  // createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
  //   return this.usersService.create(createUserInput);
  // }

  @Query(() => [User], { name: 'users' })
  users() {
    return this.usersService.findAll();
  }

  @Query(() => UserResponse, { name: 'userById' })
  async userById(@Args('id', { type: () => Int }) id: number) {
    const result = await this.usersService.findOne(id);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'User retrieved successfully',
      data: result,
    };
  }

  // @Mutation(() => User)
  // updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
  //   return this.usersService.update(updateUserInput.id, updateUserInput);
  // }

  @Mutation(() => UserResponse, { name: 'deleteUser' })
  async deleteUser(@Args('id', { type: () => Int }) id: number) {
    const result = await this.usersService.remove(id);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'User deleted successfully',
      data: result,
    };
  }

  // ============ EMPLOYEE OPERATIONS ============

  @UseGuards(GqlAuthGuard)
  @Mutation(() => UserResponse, { name: 'createEmployee' })
  createEmployee(
    @Args('createEmployeeInput') createEmployeeInput: CreateEmployeeInput,
    @CurrentUser() user: JwtPayload,
  ) {
    // VALIDATE USER
    const businessId = user.businessId;
    if (!businessId) throw new Error('Business ID not found in token');

    // GET RESPONSE
    const result = this.usersService.createEmployee(
      createEmployeeInput,
      businessId,
    );
    return {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: 'Employee created successfully',
      data: result,
    };
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => UsersQueryResponse, { name: 'employees' })
  async employees(
    @CurrentUser() user: JwtPayload,
    @Args('query', { nullable: true }) query: QueryUserInput,
  ) {
    const result = await this.usersService.findAllEmployees({ user, query });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Employees retrieved successfully',
      meta: result?.meta,
      data: result?.data,
    };
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => UserResponse, { name: 'employeeById' })
  async employee(@Args('id', { type: () => Int }) id: number) {
    const result = await this.usersService.findOneEmployee(id);

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Employee retrieved successfully',
      data: result,
    };
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => UserResponse, { name: 'updateEmployee' })
  async updateEmployee(
    @Args('updateEmployeeInput') updateEmployeeInput: UpdateEmployeeInput,
    @CurrentUser() user: JwtPayload,
  ) {
    const businessId = user.businessId;
    if (!businessId) throw new Error('Business ID not found in token');
    const result = await this.usersService.updateEmployee(
      updateEmployeeInput,
      businessId,
    );
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Employee updated successfully',
      data: result,
    };
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => UserResponse, { name: 'deleteEmployee' })
  async deleteEmployee(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    const businessId = user.businessId;
    if (!businessId) throw new Error('Business ID not found in token');
    const result = await this.usersService.removeEmployee(id, businessId);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Employee deleted successfully',
      data: result,
    };
  }
}
