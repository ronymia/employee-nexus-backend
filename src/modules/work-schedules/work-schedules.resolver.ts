// WORK SCHEDULES RESOLVER - HANDLES GRAPHQL OPERATIONS FOR WORK SCHEDULE MANAGEMENT
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { WorkSchedulesService } from './work-schedules.service';
import {
  WorkSchedule,
  WorkScheduleResponse,
  WorkSchedulesQueryResponse,
} from './entities/work-schedule.entity';
import { CreateWorkScheduleInput } from './dto/create-work-schedule.input';
import { UpdateWorkScheduleInput } from './dto/update-work-schedule.input';
import { HttpStatus, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { PermissionsGuard } from '../permissions/guards/permission.guard';
import { RequirePermissions } from '../permissions/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/jwt.strategy';
import { QueryWorkScheduleInput } from './dto/query-work-schedule.input';

@Resolver(() => WorkSchedule)
export class WorkSchedulesResolver {
  // WORK SCHEDULES SERVICE INJECTION
  constructor(private readonly workSchedulesService: WorkSchedulesService) {}

  /**
   * CREATE WORK SCHEDULE MUTATION
   *
   * Supports three schedule types:
   *
   * 1. REGULAR: Same start/end time every day
   *    - Requires exactly 7 day schedules (one for each day 0-6)
   *    - Each day must have exactly 1 time slot
   *    - All time slots must have identical start and end times
   *
   * 2. SCHEDULED: Different start/end time per day
   *    - Requires 1-7 day schedules (any days 0-6)
   *    - Each day must have exactly 1 time slot
   *    - Time slots can differ between days
   *
   * 3. FLEXIBLE: Multiple time slots per day
   *    - Requires 1-7 day schedules (any days 0-6)
   *    - Each day can have 1 or more time slots
   *    - Full flexibility in scheduling
   */
  @Mutation(() => WorkScheduleResponse, { name: 'createWorkSchedule' })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Work Schedule:create')
  @UseGuards(GqlAuthGuard)
  async createWorkSchedule(
    @Args('createWorkScheduleInput')
    createWorkScheduleInput: CreateWorkScheduleInput,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.workSchedulesService.create({
      user,
      createWorkScheduleInput,
    });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Work schedule created successfully`,
      data: result,
    };
  }

  // FIND ALL WORK SCHEDULES QUERY
  @Query(() => WorkSchedulesQueryResponse, { name: 'workSchedules' })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Work Schedule:read')
  @UseGuards(GqlAuthGuard)
  async findAll(
    @CurrentUser() user: JwtPayload,
    @Args('query', { nullable: true }) query?: QueryWorkScheduleInput,
  ) {
    const result = await this.workSchedulesService.findAll({ user, query });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Work schedules retrieved successfully`,
      meta: result?.meta,
      data: result?.data,
    };
  }

  // FIND WORK SCHEDULE BY ID QUERY
  @Query(() => WorkScheduleResponse, { name: 'workScheduleById' })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Work Schedule:read')
  @UseGuards(GqlAuthGuard)
  async findOne(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.workSchedulesService.findOne({ user, id });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Work schedule retrieved successfully`,
      data: result,
    };
  }

  // UPDATE WORK SCHEDULE MUTATION
  @Mutation(() => WorkScheduleResponse)
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Work Schedule:update')
  @UseGuards(GqlAuthGuard)
  async updateWorkSchedule(
    @CurrentUser() user: JwtPayload,
    @Args('updateWorkScheduleInput')
    updateWorkScheduleInput: UpdateWorkScheduleInput,
  ) {
    const result = await this.workSchedulesService.update({
      user,
      updateWorkScheduleInput,
    });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Work schedule updated successfully`,
      data: result,
    };
  }

  // DELETE WORK SCHEDULE MUTATION
  @Mutation(() => WorkScheduleResponse, { name: 'deleteWorkSchedule' })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Work Schedule:delete')
  @UseGuards(GqlAuthGuard)
  async removeWorkSchedule(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.workSchedulesService.remove({ user, id });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Work schedule deleted successfully`,
      data: result,
    };
  }
}
