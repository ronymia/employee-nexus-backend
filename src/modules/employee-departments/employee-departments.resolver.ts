import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { EmployeeDepartmentsService } from './employee-departments.service';
import {
  EmployeeDepartment,
  EmployeeDepartmentResponse,
  EmployeeDepartmentsArrayResponse,
} from './entities/employee-department.entity';
import {
  AssignEmployeeDepartmentInput,
  UpdateEmployeeDepartmentInput,
} from './dto/assign-employee-department.input';
import { GetEmployeeDepartmentsInput } from './dto/get-employee-departments.input';
import { HttpStatus, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/jwt.strategy';

@Resolver(() => EmployeeDepartment)
@UseGuards(GqlAuthGuard)
export class EmployeeDepartmentsResolver {
  constructor(
    private readonly employeeDepartmentsService: EmployeeDepartmentsService,
  ) {}

  // ASSIGN DEPARTMENT TO EMPLOYEE
  @Mutation(() => EmployeeDepartmentResponse, {
    description: 'Assign a department to an employee',
  })
  async assignEmployeeDepartment(
    @CurrentUser() user: JwtPayload,
    @Args('assignEmployeeDepartmentInput')
    assignEmployeeDepartmentInput: AssignEmployeeDepartmentInput,
  ) {
    const result =
      await this.employeeDepartmentsService.assignEmployeeDepartment({
        user,
        assignEmployeeDepartmentInput,
      });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Employee department assigned successfully',
      data: result,
    };
  }

  // GET ALL DEPARTMENTS
  @Query(() => EmployeeDepartmentResponse, {
    name: 'getEmployeeDepartments',
    description: 'Get employee departments with optional filters',
  })
  async getEmployeeDepartments(
    @CurrentUser() user: JwtPayload,
    @Args('getEmployeeDepartmentsInput', { nullable: true })
    getEmployeeDepartmentsInput?: GetEmployeeDepartmentsInput,
  ) {
    const result = await this.employeeDepartmentsService.getEmployeeDepartments(
      {
        user,
        getEmployeeDepartmentsInput,
      },
    );

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Employee departments retrieved successfully',
      data: result,
    };
  }

  // GET DEPARTMENT HISTORY FOR USER
  @Query(() => EmployeeDepartmentsArrayResponse, {
    name: 'departmentHistory',
    description: 'Get complete department history for an employee',
  })
  async getDepartmentHistory(
    @CurrentUser() user: JwtPayload,
    @Args('userId', { type: () => Int }) userId: number,
  ) {
    const result = await this.employeeDepartmentsService.getDepartmentHistory({
      user,
      userId,
    });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Department history retrieved successfully',
      data: result,
    };
  }

  // GET ACTIVE DEPARTMENT FOR USER
  @Query(() => EmployeeDepartmentResponse, {
    name: 'getActiveDepartment',
    description: 'Get active department for an employee',
  })
  async getActiveDepartment(
    @CurrentUser() user: JwtPayload,
    @Args('userId', { type: () => Int }) userId: number,
  ) {
    const result = await this.employeeDepartmentsService.getActiveDepartment({
      user,
      userId,
    });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Active department retrieved successfully',
      data: result,
    };
  }

  // GET DEPARTMENT BY COMPOSITE ID
  @Query(() => EmployeeDepartmentResponse, {
    name: 'getDepartmentById',
    description: 'Get specific department assignment by composite ID',
  })
  async getDepartmentById(
    @CurrentUser() user: JwtPayload,
    @Args('userId', { type: () => Int }) userId: number,
    @Args('departmentId', { type: () => Int }) departmentId: number,
  ) {
    const result = await this.employeeDepartmentsService.getByCompositeId({
      user,
      userId,
      departmentId,
    });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Department assignment retrieved successfully',
      data: result,
    };
  }

  // UPDATE EMPLOYEE DEPARTMENT
  @Mutation(() => EmployeeDepartmentResponse, {
    description: 'Update an employee department assignment',
  })
  async updateEmployeeDepartment(
    @CurrentUser() user: JwtPayload,
    @Args('updateEmployeeDepartmentInput')
    updateData: UpdateEmployeeDepartmentInput,
  ) {
    const result =
      await this.employeeDepartmentsService.updateEmployeeDepartment({
        user,
        userId: updateData.userId,
        departmentId: updateData.departmentId,
        updateData,
      });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Employee department updated successfully',
      data: result,
    };
  }
}
