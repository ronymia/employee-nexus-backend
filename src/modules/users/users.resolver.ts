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
import {
  User,
  UserResponse,
  UsersQueryResponse,
  UserStatisticsResponse,
} from './entities/user.entity';
import { CreateEmployeeInput } from './dto/create-employee.input';
import { UpdateEmployeeInput } from './dto/update-employee.input';
import { QueryUserInput } from './dto/query-user.input';
import { PermissionUtils } from 'src/utils/permission.utils';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/jwt.strategy';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { PermissionsGuard } from '../permissions/guards/permission.guard';
import { RequirePermissions } from '../permissions/decorators/permissions.decorator';
import { Department } from '../departments/entities/department.entity';
import { Designation } from '../designations/entities/designation.entity';
import { EmploymentStatus } from '../employment-status/entities/employment-status.entity';
import { WorkSite } from '../work-sites/entities/work-site.entity';
import { WorkSchedule } from '../work-schedules/entities/work-schedule.entity';

@Resolver(() => User)
@UseGuards(GqlAuthGuard, PermissionsGuard)
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

  @ResolveField(() => Department, { nullable: true })
  async department(@Parent() user: User) {
    return await this.usersService.getActiveDepartment(user.id);
  }

  @ResolveField(() => Designation, { nullable: true })
  async designation(@Parent() user: User) {
    return await this.usersService.getActiveDesignation(user.id);
  }

  @ResolveField(() => EmploymentStatus, { nullable: true })
  async employmentStatus(@Parent() user: User) {
    return await this.usersService.getActiveEmploymentStatus(user.id);
  }

  @ResolveField(() => WorkSite, { nullable: true })
  async workSite(@Parent() user: User) {
    return await this.usersService.getActiveWorkSite(user.id);
  }

  @ResolveField(() => WorkSchedule, { nullable: true })
  async workSchedule(@Parent() user: User) {
    return await this.usersService.getActiveWorkSchedule(user.id);
  }

  // @Mutation(() => User)
  // createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
  //   return this.usersService.create(createUserInput);
  // }

  @Query(() => UsersQueryResponse, { name: 'users' })
  @RequirePermissions('User:read')
  async users(
    @CurrentUser() user: JwtPayload,
    @Args('query', { nullable: true }) query?: QueryUserInput,
  ) {
    const result = await this.usersService.findAll({ user, query });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Users retrieved successfully',
      meta: result?.meta,
      data: result?.data,
    };
  }

  @Query(() => UserResponse, { name: 'userById' })
  @RequirePermissions('User:read')
  async userById(@Args('id', { type: () => Int }) id: number) {
    const result = await this.usersService.findOne(id);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'User retrieved successfully',
      data: result,
    };
  }

  @Query(() => String, { name: 'generateEmployeeId' })
  @RequirePermissions('User:read')
  async generateEmployeeId(@CurrentUser() user: JwtPayload): Promise<string> {
    const businessId = user.businessId;
    if (!businessId) throw new Error('Business ID not found in token');

    return await this.usersService.generateEmployeeId(businessId);
  }

  // @Mutation(() => User)
  // updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
  //   return this.usersService.update(updateUserInput.id, updateUserInput);
  // }

  @Mutation(() => UserResponse, { name: 'deleteUser' })
  @RequirePermissions('User:delete')
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

  @Mutation(() => UserResponse, { name: 'createEmployee' })
  @RequirePermissions('User:create')
  createEmployee(
    @Args('createEmployeeInput') createEmployeeInput: CreateEmployeeInput,
    @CurrentUser() user: JwtPayload,
  ) {
    // VALIDATE USER
    const businessId = user.businessId;
    if (!businessId) throw new Error('Business ID not found in token');

    // GET RESPONSE
    const result = this.usersService.createEmployee(createEmployeeInput, user);
    return {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: 'Employee created successfully',
      data: result,
    };
  }

  @Query(() => UsersQueryResponse, { name: 'employees' })
  @RequirePermissions('User:read')
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

  @Query(() => UserResponse, { name: 'employeeById' })
  @RequirePermissions('User:read')
  async employee(@Args('id', { type: () => Int }) id: number) {
    const result = await this.usersService.findOneEmployee(id);

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Employee retrieved successfully',
      data: result,
    };
  }

  @Mutation(() => UserResponse, { name: 'updateEmployee' })
  @RequirePermissions('User:update')
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

  @Mutation(() => UserResponse, { name: 'deleteEmployee' })
  @RequirePermissions('User:delete')
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

  @Query(() => UserResponse, { name: 'getMyProfile' })
  @RequirePermissions('User:read')
  async getMyProfile(@CurrentUser() user: JwtPayload) {
    const result = await this.usersService.findOne(user.userId);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'User retrieved successfully',
      data: result,
    };
  }

  @Query(() => UserStatisticsResponse, { name: 'userStatistics' })
  @RequirePermissions('User:read')
  async userStatistics(@CurrentUser() user: JwtPayload) {
    const businessId = user.businessId;
    if (!businessId) throw new Error('Business ID not found in token');

    const result = await this.usersService.getUserStatistics(businessId);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'User statistics retrieved successfully',
      data: result,
    };
  }
}
