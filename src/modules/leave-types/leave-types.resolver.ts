// LEAVE TYPES RESOLVER - HANDLES GRAPHQL OPERATIONS FOR LEAVE TYPE MANAGEMENT
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { LeaveTypesService } from './leave-types.service';
import {
  LeaveType,
  LeaveTypeResponse,
  LeaveTypesQueryResponse,
} from './entities/leave-type.entity';
import { CreateLeaveTypeInput } from './dto/create-leave-type.input';
import { UpdateLeaveTypeInput } from './dto/update-leave-type.input';
import { HttpStatus, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { PermissionsGuard } from '../permissions/guards/permission.guard';
import { RequirePermissions } from '../permissions/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/jwt.strategy';
import { QueryLeaveTypeInput } from './dto/query-leave-type.input';

@Resolver(() => LeaveType)
export class LeaveTypesResolver {
  // LEAVE TYPES SERVICE INJECTION
  constructor(private readonly leaveTypesService: LeaveTypesService) {}

  // CREATE LEAVE TYPE MUTATION
  @Mutation(() => LeaveTypeResponse, { name: 'createLeaveType' })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Leave Type:create')
  @UseGuards(GqlAuthGuard)
  async createLeaveType(
    @Args('createLeaveTypeInput')
    createLeaveTypeInput: CreateLeaveTypeInput,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.leaveTypesService.create({
      user,
      createLeaveTypeInput,
    });

    console.log({ employmentStatuses: result.employmentStatuses });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Leave Type created successfully`,
      data: result,
    };
  }

  // FIND ALL LEAVE TYPES QUERY
  @Query(() => LeaveTypesQueryResponse, { name: 'leaveTypes' })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Leave Type:read')
  @UseGuards(GqlAuthGuard)
  async findAll(
    @CurrentUser() user: JwtPayload,
    @Args('query', { nullable: true }) query: QueryLeaveTypeInput,
  ) {
    const result = await this.leaveTypesService.findAll({ user, query });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Leave Types retrieved successfully`,
      meta: result?.meta,
      data: result?.data,
    };
  }

  // FIND LEAVE TYPE BY ID QUERY
  @Query(() => LeaveTypeResponse, { name: 'leaveTypeById' })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Leave Type:read')
  @UseGuards(GqlAuthGuard)
  async findOne(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.leaveTypesService.findOne({ user, id });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Leave Type retrieved successfully`,
      data: result,
    };
  }

  // UPDATE LEAVE TYPE MUTATION
  @Mutation(() => LeaveTypeResponse)
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Leave Type:update')
  @UseGuards(GqlAuthGuard)
  async updateLeaveType(
    @CurrentUser() user: JwtPayload,
    @Args('updateLeaveTypeInput')
    updateLeaveTypeInput: UpdateLeaveTypeInput,
  ) {
    const result = await this.leaveTypesService.update({
      user,
      id: updateLeaveTypeInput.id,
      updateLeaveTypeInput,
    });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Leave Type updated successfully`,
      data: result,
    };
  }

  // DELETE LEAVE TYPE MUTATION
  @Mutation(() => LeaveTypeResponse, { name: 'deleteLeaveType' })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Leave Type:delete')
  @UseGuards(GqlAuthGuard)
  async removeLeaveType(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.leaveTypesService.remove({ user, id });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Leave Type deleted successfully`,
      data: result,
    };
  }
}
