import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { EmployeeWorkSchedulesService } from './employee-work-schedules.service';
import {
  EmployeeWorkSchedule,
  EmployeeWorkScheduleResponse,
  EmployeeWorkSchedulesArrayResponse,
} from './entities/employee-work-schedule.entity';
import {
  AssignEmployeeScheduleInput,
  UpdateEmployeeScheduleInput,
} from './dto/assign-employee-schedule.input';
import { GetEmployeeSchedulesInput } from './dto/get-employee-schedules.input';
import { HttpStatus, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { PermissionsGuard } from '../permissions/guards/permission.guard';
import { RequirePermissions } from '../permissions/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/jwt.strategy';

@Resolver(() => EmployeeWorkSchedule)
@UseGuards(GqlAuthGuard, PermissionsGuard)
export class EmployeeWorkSchedulesResolver {
  constructor(
    private readonly employeeWorkSchedulesService: EmployeeWorkSchedulesService,
  ) {}

  // ASSIGN WORK SCHEDULE TO EMPLOYEE
  @Mutation(() => EmployeeWorkScheduleResponse, {
    description: 'Assign a work schedule to an employee',
  })
  @RequirePermissions('Work Schedule:create')
  async assignEmployeeSchedule(
    @CurrentUser() user: JwtPayload,
    @Args('assignEmployeeScheduleInput')
    assignEmployeeScheduleInput: AssignEmployeeScheduleInput,
  ) {
    const result =
      await this.employeeWorkSchedulesService.assignEmployeeSchedule({
        user,
        assignEmployeeScheduleInput,
      });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Employee schedule assigned successfully',
      data: result,
    };
  }

  // GET EMPLOYEE WORK SCHEDULES
  @Query(() => EmployeeWorkScheduleResponse, {
    name: 'getEmployeeSchedules',
    description: 'Get employee work schedules with optional filters',
  })
  @RequirePermissions('Work Schedule:read')
  async getEmployeeSchedules(
    @CurrentUser() user: JwtPayload,
    @Args('getEmployeeSchedulesInput', { nullable: true })
    getEmployeeSchedulesInput?: GetEmployeeSchedulesInput,
  ) {
    const result = await this.employeeWorkSchedulesService.getEmployeeSchedules(
      {
        user,
        getEmployeeSchedulesInput,
      },
    );

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Employee schedules retrieved successfully',
      data: result,
    };
  }

  // GET WORK SCHEDULE HISTORY FOR USER
  @Query(() => EmployeeWorkSchedulesArrayResponse, {
    name: 'workScheduleHistory',
    description: 'Get complete work schedule history for an employee',
  })
  @RequirePermissions('Work Schedule:read')
  async getWorkScheduleHistory(
    @CurrentUser() user: JwtPayload,
    @Args('userId', { type: () => Int }) userId: number,
  ) {
    const result =
      await this.employeeWorkSchedulesService.getWorkScheduleHistory({
        user,
        userId,
      });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Work schedule history retrieved successfully',
      data: result,
    };
  }

  // GET ACTIVE WORK SCHEDULE FOR USER
  @Query(() => EmployeeWorkScheduleResponse, {
    name: 'getActiveWorkSchedule',
    description: 'Get active work schedule for an employee',
  })
  @RequirePermissions('Work Schedule:read')
  async getActiveWorkSchedule(
    @CurrentUser() user: JwtPayload,
    @Args('userId', { type: () => Int }) userId: number,
  ) {
    const result =
      await this.employeeWorkSchedulesService.getActiveWorkSchedule({
        user,
        userId,
      });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Active work schedule retrieved successfully',
      data: result,
    };
  }

  // GET WORK SCHEDULE BY COMPOSITE ID
  @Query(() => EmployeeWorkScheduleResponse, {
    name: 'getWorkScheduleById',
    description: 'Get specific work schedule assignment by composite ID',
  })
  @RequirePermissions('Work Schedule:read')
  async getWorkScheduleById(
    @CurrentUser() user: JwtPayload,
    @Args('userId', { type: () => Int }) userId: number,
    @Args('workScheduleId', { type: () => Int }) workScheduleId: number,
  ) {
    const result = await this.employeeWorkSchedulesService.getByCompositeId({
      user,
      userId,
      workScheduleId,
    });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Work schedule assignment retrieved successfully',
      data: result,
    };
  }

  // UPDATE EMPLOYEE WORK SCHEDULE
  @Mutation(() => EmployeeWorkScheduleResponse, {
    description: 'Update an employee work schedule assignment',
  })
  @RequirePermissions('Work Schedule:update')
  async updateEmployeeSchedule(
    @CurrentUser() user: JwtPayload,
    @Args('updateEmployeeScheduleInput')
    updateEmployeeScheduleInput: UpdateEmployeeScheduleInput,
  ) {
    const result =
      await this.employeeWorkSchedulesService.updateEmployeeSchedule({
        user,
        userId: updateEmployeeScheduleInput.userId,
        workScheduleId: updateEmployeeScheduleInput.workScheduleId,
        updateData: updateEmployeeScheduleInput,
      });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Employee work schedule updated successfully',
      data: result,
    };
  }
}
