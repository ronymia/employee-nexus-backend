import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  Field,
  ObjectType,
} from '@nestjs/graphql';
import { LeavesService } from './leaves.service';
import {
  Leave,
  LeaveResponse,
  LeavesQueryResponse,
} from './entities/leave.entity';
import { CreateLeaveInput } from './dto/create-leave.input';
import { UpdateLeaveInput } from './dto/update-leave.input';
import { HttpStatus, UseGuards } from '@nestjs/common';
import { PermissionsGuard } from '../permissions/guards/permission.guard';
import { RequirePermissions } from '../permissions/decorators/permissions.decorator';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { JwtPayload } from '../auth/jwt.strategy';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { QueryLeaveInput } from './dto/query-leave.input';

@ObjectType()
class LeaveBalanceData {
  @Field(() => Int)
  leaveTypeId: number;

  @Field(() => String)
  leaveTypeName: string;

  @Field(() => Int)
  year: number;

  @Field(() => Int)
  allocatedHours: number;

  @Field(() => Int)
  usedHours: number;

  @Field(() => Int)
  remainingHours: number;
}

@ObjectType()
class LeaveBalanceResponse {
  @Field(() => Boolean)
  success: boolean;

  @Field(() => Int)
  statusCode: number;

  @Field(() => String)
  message: string;

  @Field(() => LeaveBalanceData)
  data: LeaveBalanceData;
}

@Resolver(() => Leave)
@UseGuards(GqlAuthGuard, PermissionsGuard)
export class LeavesResolver {
  constructor(private readonly leavesService: LeavesService) {}

  // CREATE LEAVE
  @Mutation(() => LeaveResponse, { name: 'createLeave' })
  @RequirePermissions('Leave:create')
  async createLeave(
    @Args('createLeaveInput') createLeaveInput: CreateLeaveInput,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.leavesService.create({
      user,
      createLeaveInput,
    });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Leave request created successfully`,
      data: result,
    };
  }

  // FIND ALL LEAVES
  @Query(() => LeavesQueryResponse, { name: 'leaves' })
  @RequirePermissions('Leave:read')
  async findAll(
    @CurrentUser() user: JwtPayload,
    @Args('query', { nullable: true }) query: QueryLeaveInput,
  ) {
    const result = await this.leavesService.findAll({ user, query });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Leaves retrieved successfully`,
      meta: result?.meta,
      data: result?.data,
    };
  }

  // FIND ONE LEAVE
  @Query(() => LeaveResponse, { name: 'leaveById' })
  @RequirePermissions('Leave:read')
  async findOne(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.leavesService.findOne({ user, id });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Leave retrieved successfully`,
      data: result,
    };
  }

  // UPDATE LEAVE
  @Mutation(() => LeaveResponse, { name: 'updateLeave' })
  @RequirePermissions('Leave:update')
  async updateLeave(
    @CurrentUser() user: JwtPayload,
    @Args('updateLeaveInput') updateLeaveInput: UpdateLeaveInput,
  ) {
    const result = await this.leavesService.update({
      user,
      id: updateLeaveInput.id,
      updateLeaveInput,
    });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Leave updated successfully`,
      data: result,
    };
  }

  // REMOVE LEAVE
  @Mutation(() => LeaveResponse, { name: 'deleteLeave' })
  @RequirePermissions('Leave:delete')
  async removeLeave(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.leavesService.remove({ user, id });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Leave deleted successfully`,
      data: result,
    };
  }

  // GET LEAVE BALANCE
  @Query(() => LeaveBalanceResponse, { name: 'leaveBalance' })
  @RequirePermissions('Leave:read')
  async getLeaveBalance(
    @CurrentUser() user: JwtPayload,
    @Args('leaveTypeId', { type: () => Int }) leaveTypeId: number,
    @Args('employmentStatusId', { type: () => Int }) employmentStatusId: number,
    @Args('year', { type: () => Int }) year: number,
  ) {
    const result = await this.leavesService.getLeaveBalance({
      user,
      leaveTypeId,
      employmentStatusId,
      year,
    });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Leave balance retrieved successfully`,
      data: result,
    };
  }
}
