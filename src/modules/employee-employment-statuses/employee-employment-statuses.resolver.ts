import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { EmployeeEmploymentStatusesService } from './employee-employment-statuses.service';
import {
  EmployeeEmploymentStatus,
  EmployeeEmploymentStatusResponse,
} from './entities/employee-employment-status.entity';
import { AssignEmployeeStatusInput } from './dto/assign-employee-status.input';
import { GetEmployeeStatusesInput } from './dto/get-employee-statuses.input';
import { HttpStatus, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/jwt.strategy';

@Resolver(() => EmployeeEmploymentStatus)
@UseGuards(GqlAuthGuard)
export class EmployeeEmploymentStatusesResolver {
  constructor(
    private readonly employeeEmploymentStatusesService: EmployeeEmploymentStatusesService,
  ) {}

  // ASSIGN EMPLOYMENT STATUS TO EMPLOYEE
  @Mutation(() => EmployeeEmploymentStatusResponse, {
    description: 'Assign an employment status to an employee',
  })
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
}
