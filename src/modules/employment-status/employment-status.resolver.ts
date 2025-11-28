// EMPLOYMENT STATUS RESOLVER - HANDLES GRAPHQL OPERATIONS FOR EMPLOYMENT STATUS MANAGEMENT
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { EmploymentStatusService } from './employment-status.service';
import {
  EmploymentStatus,
  EmploymentStatusResponse,
  EmploymentStatusesQueryResponse,
} from './entities/employment-status.entity';
import { CreateEmploymentStatusInput } from './dto/create-employment-status.input';
import { UpdateEmploymentStatusInput } from './dto/update-employment-status.input';
import { HttpStatus, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { PermissionsGuard } from '../permissions/guards/permission.guard';
import { RequirePermissions } from '../permissions/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/jwt.strategy';
import { QueryEmploymentStatusInput } from './dto/query-employment-status.input';

@Resolver(() => EmploymentStatus)
export class EmploymentStatusResolver {
  // EMPLOYMENT STATUS SERVICE INJECTION
  constructor(
    private readonly employmentStatusService: EmploymentStatusService,
  ) {}

  // CREATE EMPLOYMENT STATUS MUTATION
  @Mutation(() => EmploymentStatusResponse, { name: 'createEmploymentStatus' })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Employment Status:create')
  @UseGuards(GqlAuthGuard)
  async createEmploymentStatus(
    @Args('createEmploymentStatusInput')
    createEmploymentStatusInput: CreateEmploymentStatusInput,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.employmentStatusService.create({
      user,
      createEmploymentStatusInput,
    });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Employment Status created successfully`,
      data: result,
    };
  }

  // FIND ALL EMPLOYMENT STATUSES QUERY
  @Query(() => EmploymentStatusesQueryResponse, { name: 'employmentStatuses' })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Employment Status:read')
  @UseGuards(GqlAuthGuard)
  async findAll(
    @CurrentUser() user: JwtPayload,
    @Args('query', { nullable: true }) query: QueryEmploymentStatusInput,
  ) {
    const result = await this.employmentStatusService.findAll({ user, query });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Employment Statuses retrieved successfully`,
      meta: result?.meta,
      data: result?.data,
    };
  }

  // FIND EMPLOYMENT STATUS BY ID QUERY
  @Query(() => EmploymentStatusResponse, { name: 'employmentStatusById' })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Employment Status:read')
  @UseGuards(GqlAuthGuard)
  async findOne(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.employmentStatusService.findOne({ user, id });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Employment Status retrieved successfully`,
      data: result,
    };
  }

  // UPDATE EMPLOYMENT STATUS MUTATION
  @Mutation(() => EmploymentStatusResponse)
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Employment Status:update')
  @UseGuards(GqlAuthGuard)
  async updateEmploymentStatus(
    @CurrentUser() user: JwtPayload,
    @Args('updateEmploymentStatusInput')
    updateEmploymentStatusInput: UpdateEmploymentStatusInput,
  ) {
    const result = await this.employmentStatusService.update({
      user,
      id: updateEmploymentStatusInput.id,
      updateEmploymentStatusInput,
    });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Employment Status updated successfully`,
      data: result,
    };
  }

  // DELETE EMPLOYMENT STATUS MUTATION
  @Mutation(() => EmploymentStatusResponse, { name: 'deleteEmploymentStatus' })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Employment Status:delete')
  @UseGuards(GqlAuthGuard)
  async removeEmploymentStatus(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.employmentStatusService.remove({ user, id });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Employment Status deleted successfully`,
      data: result,
    };
  }
}
