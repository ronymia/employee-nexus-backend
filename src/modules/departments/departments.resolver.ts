// DEPARTMENTS RESOLVER - HANDLES GRAPHQL OPERATIONS FOR DEPARTMENT MANAGEMENT
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { DepartmentsService } from './departments.service';
import {
  Department,
  DepartmentResponse,
  DepartmentsQueryResponse,
} from './entities/department.entity';
import { CreateDepartmentInput } from './dto/create-department.input';
import { UpdateDepartmentInput } from './dto/update-department.input';
import { HttpStatus, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { PermissionsGuard } from '../permissions/guards/permission.guard';
import { RequirePermissions } from '../permissions/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/jwt.strategy';
import { QueryDepartmentInput } from './dto/query-department.input';

@Resolver(() => Department)
export class DepartmentsResolver {
  // DEPARTMENTS SERVICE INJECTION
  constructor(private readonly departmentsService: DepartmentsService) {}

  // CREATE DEPARTMENT MUTATION
  @Mutation(() => DepartmentResponse, { name: 'createDepartment' })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Department:create')
  @UseGuards(GqlAuthGuard)
  async createDepartment(
    @Args('createDepartmentInput')
    createDepartmentInput: CreateDepartmentInput,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.departmentsService.create({
      user,
      createDepartmentInput,
    });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Department created successfully`,
      data: result,
    };
  }

  // FIND ALL DEPARTMENTS QUERY
  @Query(() => DepartmentsQueryResponse, { name: 'departments' })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Department:read')
  @UseGuards(GqlAuthGuard)
  async findAll(
    @CurrentUser() user: JwtPayload,
    @Args('query', { nullable: true }) query: QueryDepartmentInput,
  ) {
    const result = await this.departmentsService.findAll({ user, query });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Departments retrieved successfully`,
      meta: result?.meta,
      data: result?.data,
    };
  }

  // FIND DEPARTMENT BY ID QUERY
  @Query(() => DepartmentResponse, { name: 'departmentById' })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Department:read')
  @UseGuards(GqlAuthGuard)
  async findOne(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.departmentsService.findOne({ user, id });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Department retrieved successfully`,
      data: result,
    };
  }

  // UPDATE DEPARTMENT MUTATION
  @Mutation(() => DepartmentResponse)
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Department:update')
  @UseGuards(GqlAuthGuard)
  async updateDepartment(
    @CurrentUser() user: JwtPayload,
    @Args('updateDepartmentInput')
    updateDepartmentInput: UpdateDepartmentInput,
  ) {
    const result = await this.departmentsService.update({
      user,
      id: updateDepartmentInput.id,
      updateDepartmentInput,
    });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Department updated successfully`,
      data: result,
    };
  }

  // DELETE DEPARTMENT MUTATION
  @Mutation(() => DepartmentResponse, { name: 'deleteDepartment' })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Department:delete')
  @UseGuards(GqlAuthGuard)
  async removeDepartment(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.departmentsService.remove({ user, id });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Department deleted successfully`,
      data: result,
    };
  }
}
