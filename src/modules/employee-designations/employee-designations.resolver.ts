import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { EmployeeDesignationsService } from './employee-designations.service';
import {
  EmployeeDesignation,
  EmployeeDesignationResponse,
  EmployeeDesignationsArrayResponse,
} from './entities/employee-designation.entity';
import {
  AssignEmployeeDesignationInput,
  UpdateEmployeeDesignationInput,
} from './dto/assign-employee-designation.input';
import { GetEmployeeDesignationsInput } from './dto/get-employee-designations.input';
import { HttpStatus, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/jwt.strategy';

@Resolver(() => EmployeeDesignation)
@UseGuards(GqlAuthGuard)
export class EmployeeDesignationsResolver {
  constructor(
    private readonly employeeDesignationsService: EmployeeDesignationsService,
  ) {}

  // ASSIGN DESIGNATION TO EMPLOYEE
  @Mutation(() => EmployeeDesignationResponse, {
    description: 'Assign a designation to an employee',
  })
  async assignEmployeeDesignation(
    @CurrentUser() user: JwtPayload,
    @Args('assignEmployeeDesignationInput')
    assignEmployeeDesignationInput: AssignEmployeeDesignationInput,
  ) {
    const result =
      await this.employeeDesignationsService.assignEmployeeDesignation({
        user,
        assignEmployeeDesignationInput,
      });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Employee designation assigned successfully',
      data: result,
    };
  }

  // GET ALL DESIGNATION
  @Query(() => EmployeeDesignationResponse, {
    name: 'getEmployeeDesignations',
    description: 'Get employee designations with optional filters',
  })
  async getEmployeeDesignations(
    @CurrentUser() user: JwtPayload,
    @Args('getEmployeeDesignationsInput', { nullable: true })
    getEmployeeDesignationsInput?: GetEmployeeDesignationsInput,
  ) {
    const result =
      await this.employeeDesignationsService.getEmployeeDesignations({
        user,
        getEmployeeDesignationsInput,
      });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Employee designations retrieved successfully',
      data: result,
    };
  }

  // GET DESIGNATION HISTORY FOR USER
  @Query(() => EmployeeDesignationsArrayResponse, {
    name: 'designationHistory',
    description: 'Get complete designation history for an employee',
  })
  async getDesignationHistory(
    @CurrentUser() user: JwtPayload,
    @Args('userId', { type: () => Int }) userId: number,
  ) {
    const result = await this.employeeDesignationsService.getDesignationHistory(
      {
        user,
        userId,
      },
    );

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Designation history retrieved successfully',
      data: result,
    };
  }

  // GET ACTIVE DESIGNATION FOR USER
  @Query(() => EmployeeDesignationResponse, {
    name: 'getActiveDesignation',
    description: 'Get active designation for an employee',
  })
  async getActiveDesignation(
    @CurrentUser() user: JwtPayload,
    @Args('userId', { type: () => Int }) userId: number,
  ) {
    const result = await this.employeeDesignationsService.getActiveDesignation({
      user,
      userId,
    });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Active designation retrieved successfully',
      data: result,
    };
  }

  // GET DESIGNATION BY COMPOSITE ID
  @Query(() => EmployeeDesignationResponse, {
    name: 'getDesignationById',
    description: 'Get specific designation assignment by composite ID',
  })
  async getDesignationById(
    @CurrentUser() user: JwtPayload,
    @Args('userId', { type: () => Int }) userId: number,
    @Args('designationId', { type: () => Int }) designationId: number,
  ) {
    const result = await this.employeeDesignationsService.getByCompositeId({
      user,
      userId,
      designationId,
    });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Designation assignment retrieved successfully',
      data: result,
    };
  }

  // UPDATE EMPLOYEE DESIGNATION
  @Mutation(() => EmployeeDesignationResponse, {
    description: 'Update an employee designation assignment',
  })
  async updateEmployeeDesignation(
    @CurrentUser() user: JwtPayload,
    @Args('updateEmployeeDesignationInput')
    updateEmployeeDesignationInput: UpdateEmployeeDesignationInput,
  ) {
    const result =
      await this.employeeDesignationsService.updateEmployeeDesignation({
        user,
        userId: updateEmployeeDesignationInput.userId,
        designationId: updateEmployeeDesignationInput.designationId,
        updateData: updateEmployeeDesignationInput,
      });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Employee designation updated successfully',
      data: result,
    };
  }
}
