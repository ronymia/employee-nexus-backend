import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { EmployeeDesignationsService } from './employee-designations.service';
import {
  EmployeeDesignation,
  EmployeeDesignationResponse,
} from './entities/employee-designation.entity';
import { AssignEmployeeDesignationInput } from './dto/assign-employee-designation.input';
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
}
