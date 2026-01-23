import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { HttpStatus, UseGuards } from '@nestjs/common';
import { EmployeePayrollComponentsService } from './employee-payroll-components.service';
import {
  EmployeePayrollComponent,
  EmployeePayrollComponentResponse,
  EmployeePayrollComponentsQueryResponse,
} from './entities/employee-payroll-component.entity';
import { PermissionsGuard } from '../permissions/guards/permission.guard';
import { RequirePermissions } from '../permissions/decorators/permissions.decorator';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/jwt.strategy';
import {
  AssignEmployeePayrollComponentInput,
  QueryEmployeePayrollComponentInput,
  UpdateEmployeePayrollComponentInput,
} from './dto';

@Resolver(() => EmployeePayrollComponent)
@UseGuards(GqlAuthGuard, PermissionsGuard)
export class EmployeePayrollComponentsResolver {
  constructor(
    private readonly employeePayrollComponentsService: EmployeePayrollComponentsService,
  ) {}

  // ASSIGN PAYROLL COMPONENT TO EMPLOYEE
  @Mutation(() => EmployeePayrollComponentResponse, {
    name: 'assignEmployeePayrollComponent',
  })
  @RequirePermissions('Payroll Component:create')
  async assignEmployeePayrollComponent(
    @CurrentUser() user: JwtPayload,
    @Args('assignEmployeePayrollComponentInput')
    assignEmployeePayrollComponentInput: AssignEmployeePayrollComponentInput,
  ) {
    const result = await this.employeePayrollComponentsService.assign({
      user,
      input: assignEmployeePayrollComponentInput,
    });
    return {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: 'Payroll component assigned successfully',
      data: result,
    };
  }

  // UPDATE PAYROLL COMPONENT FOR EMPLOYEE
  @Mutation(() => EmployeePayrollComponentResponse, {
    name: 'updateEmployeePayrollComponent',
  })
  @RequirePermissions('Payroll Component:update')
  async updateEmployeePayrollComponent(
    @CurrentUser() user: JwtPayload,
    @Args('updateEmployeePayrollComponentInput')
    updateEmployeePayrollComponentInput: UpdateEmployeePayrollComponentInput,
  ) {
    const result =
      await this.employeePayrollComponentsService.updateEmployeePayrollComponent(
        {
          user,
          input: updateEmployeePayrollComponentInput,
        },
      );
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Payroll component updated successfully',
      data: result,
    };
  }

  // GET ALL EMPLOYEE PAYROLL COMPONENTS
  @Query(() => EmployeePayrollComponentsQueryResponse, {
    name: 'employeePayrollComponents',
  })
  @RequirePermissions('Payroll Component:read')
  async findAll(
    @CurrentUser() user: JwtPayload,
    @Args('query', { nullable: true })
    query?: QueryEmployeePayrollComponentInput,
  ) {
    const result = await this.employeePayrollComponentsService.findAll({
      user,
      query,
    });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Employee payroll components retrieved successfully',
      data: result,
    };
  }

  // GET ONE EMPLOYEE PAYROLL COMPONENT
  @Query(() => EmployeePayrollComponentResponse, {
    name: 'employeePayrollComponent',
  })
  @RequirePermissions('Payroll Component:read')
  async findOne(
    @CurrentUser() user: JwtPayload,
    @Args('id', { type: () => Int }) id: number,
  ) {
    const result = await this.employeePayrollComponentsService.findOne({
      user,
      id,
    });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Employee payroll component retrieved successfully',
      data: result,
    };
  }

  // GET ACTIVE EMPLOYEE PAYROLL COMPONENTS
  @Query(() => EmployeePayrollComponentsQueryResponse, {
    name: 'activeEmployeePayrollComponents',
  })
  @RequirePermissions('Payroll Component:read')
  async activeEmployeePayrollComponents(
    @CurrentUser() user: JwtPayload,
    @Args('query', { nullable: true })
    query?: QueryEmployeePayrollComponentInput,
  ) {
    const result =
      await this.employeePayrollComponentsService.activeEmployeePayrollComponents(
        {
          user,
          query,
        },
      );
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Active employee payroll components retrieved successfully',
      data: result,
    };
  }

  // GET EMPLOYEE PAYROLL COMPONENT HISTORY
  @Query(() => EmployeePayrollComponentsQueryResponse, {
    name: 'employeePayrollComponentHistory',
  })
  @RequirePermissions('Payroll Component:read')
  async employeePayrollComponentHistory(
    @CurrentUser() user: JwtPayload,
    @Args('query', { nullable: true })
    query?: QueryEmployeePayrollComponentInput,
  ) {
    const result =
      await this.employeePayrollComponentsService.employeePayrollComponentHistory(
        {
          user,
          query,
        },
      );
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Employee payroll component history retrieved successfully',
      data: result,
    };
  }
}
