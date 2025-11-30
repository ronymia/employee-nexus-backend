import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { EmployeeScheduleAssignmentsService } from './employee-schedule-assignments.service';
import {
  EmployeeScheduleAssignment,
  EmployeeScheduleAssignmentResponse,
  EmployeeScheduleAssignmentsQueryResponse,
} from './entities/employee-schedule-assignment.entity';
import { CreateEmployeeScheduleAssignmentInput } from './dto/create-employee-schedule-assignment.input';
import { UpdateEmployeeScheduleAssignmentInput } from './dto/update-employee-schedule-assignment.input';
import { HttpStatus, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { PermissionsGuard } from '../permissions/guards/permission.guard';
import { RequirePermissions } from '../permissions/decorators/permissions.decorator';
import { JwtPayload } from '../auth/jwt.strategy';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Resolver(() => EmployeeScheduleAssignment)
export class EmployeeScheduleAssignmentsResolver {
  constructor(
    private readonly employeeScheduleAssignmentsService: EmployeeScheduleAssignmentsService,
  ) {}

  // CREATE SCHEDULE ASSIGNMENT
  @Mutation(() => EmployeeScheduleAssignmentResponse, {
    name: 'createEmployeeScheduleAssignment',
  })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Work Schedule:create')
  @UseGuards(GqlAuthGuard)
  async createEmployeeScheduleAssignment(
    @Args('createEmployeeScheduleAssignmentInput')
    createEmployeeScheduleAssignmentInput: CreateEmployeeScheduleAssignmentInput,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.employeeScheduleAssignmentsService.create({
      user,
      createEmployeeScheduleAssignmentInput,
    });
    return {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: `Employee schedule assignment created successfully`,
      data: result,
    };
  }

  // FIND ALL SCHEDULE ASSIGNMENTS
  @Query(() => EmployeeScheduleAssignmentsQueryResponse, {
    name: 'employeeScheduleAssignments',
  })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Work Schedule:read')
  @UseGuards(GqlAuthGuard)
  async findAll(@CurrentUser() user: JwtPayload) {
    const result = await this.employeeScheduleAssignmentsService.findAll({
      user,
    });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Employee schedule assignments retrieved successfully`,
      data: result,
    };
  }

  // FIND SCHEDULE ASSIGNMENTS BY USER
  @Query(() => EmployeeScheduleAssignmentsQueryResponse, {
    name: 'employeeScheduleAssignmentsByUser',
  })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Work Schedule:read')
  @UseGuards(GqlAuthGuard)
  async findByUserId(
    @Args('userId', { type: () => Int }) userId: number,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.employeeScheduleAssignmentsService.findByUserId({
      user,
      userId,
    });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Employee schedule assignments retrieved successfully`,
      data: result,
    };
  }

  // FIND ACTIVE SCHEDULE ASSIGNMENT BY USER
  @Query(() => EmployeeScheduleAssignmentResponse, {
    name: 'activeEmployeeScheduleAssignment',
  })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Work Schedule:read')
  @UseGuards(GqlAuthGuard)
  async findActiveByUserId(
    @Args('userId', { type: () => Int }) userId: number,
    @CurrentUser() user: JwtPayload,
  ) {
    const result =
      await this.employeeScheduleAssignmentsService.findActiveByUserId({
        user,
        userId,
      });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Active employee schedule assignment retrieved successfully`,
      data: result,
    };
  }

  // FIND ONE SCHEDULE ASSIGNMENT
  @Query(() => EmployeeScheduleAssignmentResponse, {
    name: 'employeeScheduleAssignment',
  })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Work Schedule:read')
  @UseGuards(GqlAuthGuard)
  async findOne(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.employeeScheduleAssignmentsService.findOne({
      user,
      id,
    });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Employee schedule assignment retrieved successfully`,
      data: result,
    };
  }

  // UPDATE SCHEDULE ASSIGNMENT
  @Mutation(() => EmployeeScheduleAssignmentResponse, {
    name: 'updateEmployeeScheduleAssignment',
  })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Work Schedule:update')
  @UseGuards(GqlAuthGuard)
  async updateEmployeeScheduleAssignment(
    @CurrentUser() user: JwtPayload,
    @Args('updateEmployeeScheduleAssignmentInput')
    updateEmployeeScheduleAssignmentInput: UpdateEmployeeScheduleAssignmentInput,
  ) {
    const result = await this.employeeScheduleAssignmentsService.update({
      user,
      id: updateEmployeeScheduleAssignmentInput.id,
      updateEmployeeScheduleAssignmentInput,
    });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Employee schedule assignment updated successfully`,
      data: result,
    };
  }

  // REMOVE SCHEDULE ASSIGNMENT
  @Mutation(() => EmployeeScheduleAssignmentResponse, {
    name: 'deleteEmployeeScheduleAssignment',
  })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Work Schedule:delete')
  @UseGuards(GqlAuthGuard)
  async removeEmployeeScheduleAssignment(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.employeeScheduleAssignmentsService.remove({
      user,
      id,
    });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Employee schedule assignment deleted successfully`,
      data: result,
    };
  }
}
