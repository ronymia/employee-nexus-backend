import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { EmployeeDepartmentsService } from './employee-departments.service';
import {
  EmployeeDepartment,
  EmployeeDepartmentResponse,
} from './entities/employee-department.entity';
import { AssignEmployeeDepartmentInput } from './dto/assign-employee-department.input';
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
}
