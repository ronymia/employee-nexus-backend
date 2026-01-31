import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { EmployeeEmploymentStatusesService } from './employee-employment-statuses.service';
import {
  EmployeeEmploymentStatus,
  EmployeeEmploymentStatusResponse,
  EmployeeEmploymentStatusesArrayResponse,
} from './entities/employee-employment-status.entity';
import {
  AssignEmployeeStatusInput,
  UpdateEmployeeStatusInput,
} from './dto/assign-employee-status.input';
import { GetEmployeeStatusesInput } from './dto/get-employee-statuses.input';
import { HttpStatus, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { PermissionsGuard } from '../permissions/guards/permission.guard';
import { RequirePermissions } from '../permissions/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/jwt.strategy';

@Resolver(() => EmployeeEmploymentStatus)
@UseGuards(GqlAuthGuard, PermissionsGuard)
export class EmployeeEmploymentStatusesResolver {
  constructor(
    private readonly employeeEmploymentStatusesService: EmployeeEmploymentStatusesService,
  ) {}

  // ASSIGN EMPLOYMENT STATUS TO EMPLOYEE
  @Mutation(() => EmployeeEmploymentStatusResponse, {
    description: 'Assign an employment status to an employee',
  })
  @RequirePermissions('Employment Status:create')
  async assignEmployeeStatus(
    @CurrentUser() user: JwtPayload,
    @Args('assignEmployeeStatusInput')
    assignEmployeeStatusInput: AssignEmployeeStatusInput,
  ) {
    const result =
      await this.employeeEmploymentStatusesService.assignEmployeeStatus({
        user,
        assignEmployeeStatusInput,
      });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Employee status assigned successfully',
      data: result,
    };
  }

  // GET EMPLOYEE EMPLOYMENT STATUSES
  @Query(() => EmployeeEmploymentStatusResponse, {
    name: 'getEmployeeStatuses',
    description: 'Get employee employment statuses with optional filters',
  })
  async getEmployeeStatuses(
    @CurrentUser() user: JwtPayload,
    @Args('getEmployeeStatusesInput', { nullable: true })
    getEmployeeStatusesInput?: GetEmployeeStatusesInput,
  ) {
    const result =
      await this.employeeEmploymentStatusesService.getEmployeeStatuses({
        user,
        getEmployeeStatusesInput,
      });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Employee statuses retrieved successfully',
      data: result,
    };
  }

  // GET EMPLOYMENT STATUS HISTORY FOR USER
  @Query(() => EmployeeEmploymentStatusesArrayResponse, {
    name: 'employmentStatusHistory',
    description: 'Get complete employment status history for an employee',
  })
  async getEmploymentStatusHistory(
    @CurrentUser() user: JwtPayload,
    @Args('userId', { type: () => Int }) userId: number,
  ) {
    const result =
      await this.employeeEmploymentStatusesService.getEmploymentStatusHistory({
        user,
        userId,
      });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Employment status history retrieved successfully',
      data: result,
    };
  }

  // GET ACTIVE EMPLOYMENT STATUS FOR USER
  @Query(() => EmployeeEmploymentStatusResponse, {
    name: 'getActiveEmploymentStatus',
    description: 'Get active employment status for an employee',
  })
  async getActiveEmploymentStatus(
    @CurrentUser() user: JwtPayload,
    @Args('userId', { type: () => Int }) userId: number,
  ) {
    const result =
      await this.employeeEmploymentStatusesService.getActiveEmploymentStatus({
        user,
        userId,
      });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Active employment status retrieved successfully',
      data: result,
    };
  }

  // GET EMPLOYMENT STATUS BY COMPOSITE ID
  @Query(() => EmployeeEmploymentStatusResponse, {
    name: 'getEmploymentStatusById',
    description: 'Get specific employment status assignment by composite ID',
  })
  async getEmploymentStatusById(
    @CurrentUser() user: JwtPayload,
    @Args('userId', { type: () => Int }) userId: number,
    @Args('employmentStatusId', { type: () => Int })
    employmentStatusId: number,
  ) {
    const result =
      await this.employeeEmploymentStatusesService.getByCompositeId({
        user,
        userId,
        employmentStatusId,
      });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Employment status assignment retrieved successfully',
      data: result,
    };
  }

  // UPDATE EMPLOYEE STATUS
  @Mutation(() => EmployeeEmploymentStatusResponse, {
    description: 'Update an employee employment status assignment',
  })
  async updateEmployeeStatus(
    @CurrentUser() user: JwtPayload,
    @Args('updateEmployeeStatusInput')
    updateEmployeeStatusInput: UpdateEmployeeStatusInput,
  ) {
    const result =
      await this.employeeEmploymentStatusesService.updateEmployeeStatus({
        user,
        userId: updateEmployeeStatusInput.userId,
        employmentStatusId: updateEmployeeStatusInput.employmentStatusId,
        updateData: updateEmployeeStatusInput,
      });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Employee status updated successfully',
      data: result,
    };
  }
}
