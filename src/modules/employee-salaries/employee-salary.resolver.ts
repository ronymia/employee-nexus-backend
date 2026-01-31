import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { HttpStatus, UseGuards } from '@nestjs/common';
import { EmployeeSalariesService } from './employee-salary.service';
import {
  EmployeeSalary,
  EmployeeSalaryResponse,
  EmployeeSalariesQueryResponse,
} from './entities/employee-salary.entity';
import { CreateEmployeeSalaryInput } from './dto/create-employee-salary.input';
import { UpdateEmployeeSalaryInput } from './dto/update-employee-salary.input';
import { QueryEmployeeSalaryInput } from './dto/query-employee-salary.input';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { PermissionsGuard } from '../permissions/guards/permission.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/jwt.strategy';

@Resolver(() => EmployeeSalary)
@UseGuards(GqlAuthGuard, PermissionsGuard)
export class EmployeeSalariesResolver {
  constructor(private readonly salariesService: EmployeeSalariesService) {}

  // CREATE SALARY
  @Mutation(() => EmployeeSalaryResponse, { name: 'createSalary' })
  @RequirePermissions('Salary:create')
  async createSalary(
    @Args('createEmployeeSalaryInput')
    createEmployeeSalaryInput: CreateEmployeeSalaryInput,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.salariesService.create({
      user,
      createEmployeeSalaryInput,
    });
    return {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: 'Salary record created successfully',
      data: result,
    };
  }

  // FIND ALL SALARIES
  @Query(() => EmployeeSalariesQueryResponse, { name: 'salaries' })
  @RequirePermissions('Salary:read')
  async findAll(
    @CurrentUser() user: JwtPayload,
    @Args('query', { nullable: true }) query?: QueryEmployeeSalaryInput,
  ) {
    const result = await this.salariesService.findAll({ user, query });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Salaries retrieved successfully',
      meta: result?.meta,
      data: result?.data,
    };
  }

  // FIND ONE SALARY
  @Query(() => EmployeeSalaryResponse, { name: 'salaryById' })
  @RequirePermissions('Salary:read')
  async findOne(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.salariesService.findOne({ user, id });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Salary record retrieved successfully',
      data: result,
    };
  }

  // UPDATE SALARY
  @Mutation(() => EmployeeSalaryResponse, { name: 'updateSalary' })
  @RequirePermissions('Salary:update')
  async updateSalary(
    @Args('updateEmployeeSalaryInput')
    updateEmployeeSalaryInput: UpdateEmployeeSalaryInput,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.salariesService.update({
      user,
      updateEmployeeSalaryInput,
    });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Salary record updated successfully',
      data: result,
    };
  }

  // DELETE SALARY
  @Mutation(() => EmployeeSalaryResponse, { name: 'deleteSalary' })
  @RequirePermissions('Salary:delete')
  async removeSalary(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.salariesService.remove({ user, id });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Salary record deleted successfully',
      data: result,
    };
  }

  // GET ACTIVE SALARY FOR USER
  @Query(() => EmployeeSalaryResponse, { name: 'activeSalaryByUserId' })
  @RequirePermissions('Salary:read')
  async getActiveSalary(
    @Args('userId', { type: () => Int }) userId: number,
    @CurrentUser() user: JwtPayload,
  ) {
    const businessId = user.businessId;
    if (!businessId) throw new Error('Business ID not found in token');

    const result = await this.salariesService.getActiveSalary(userId);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Active salary retrieved successfully',
      data: result,
    };
  }

  // GET SALARY HISTORY FOR USER
  @Query(() => EmployeeSalariesQueryResponse, { name: 'salaryHistory' })
  @RequirePermissions('Salary:read')
  async getSalaryHistory(
    @Args('userId', { type: () => Int }) userId: number,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.salariesService.getSalaryHistory({
      user,
      userId,
    });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Salary history retrieved successfully',
      data: result,
    };
  }
}
