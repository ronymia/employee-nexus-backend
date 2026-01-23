import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { HttpStatus, UseGuards } from '@nestjs/common';
import { PayrollComponentsService } from './payroll-components.service';
import {
  PayrollComponent,
  PayrollComponentResponse,
  PayrollComponentsQueryResponse,
} from './entities/payroll-component.entity';
import { PayrollComponentOverviewResponse } from './entities/payroll-component-overview.entity';
import {
  CreatePayrollComponentInput,
  UpdatePayrollComponentInput,
  QueryPayrollComponentInput,
} from './dto';
import { PermissionsGuard } from '../permissions/guards/permission.guard';
import { RequirePermissions } from '../permissions/decorators/permissions.decorator';
import { JwtPayload } from '../auth/jwt.strategy';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';

@Resolver(() => PayrollComponent)
@UseGuards(GqlAuthGuard, PermissionsGuard)
export class PayrollComponentsResolver {
  constructor(
    private readonly payrollComponentsService: PayrollComponentsService,
  ) {}

  // PAYROLL COMPONENT OVERVIEW
  @Query(() => PayrollComponentOverviewResponse, {
    name: 'payrollComponentOverview',
  })
  @RequirePermissions('Payroll Component:read')
  async payrollComponentOverview(@CurrentUser() user: JwtPayload) {
    const result =
      await this.payrollComponentsService.getPayrollComponentOverview({
        user,
      });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Payroll component overview retrieved successfully`,
      data: result,
    };
  }

  @Mutation(() => PayrollComponentResponse, { name: 'createPayrollComponent' })
  @RequirePermissions('Payroll Component:create')
  async createPayrollComponent(
    @CurrentUser() user: JwtPayload,
    @Args('createPayrollComponentInput') input: CreatePayrollComponentInput,
  ) {
    const component = await this.payrollComponentsService.create(user, input);
    return {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: 'Payroll component created successfully',
      data: component,
    };
  }

  @Query(() => PayrollComponentsQueryResponse, { name: 'payrollComponents' })
  @RequirePermissions('Payroll Component:read')
  async payrollComponents(
    @CurrentUser() user: JwtPayload,
    @Args('query', { nullable: true }) query: QueryPayrollComponentInput,
  ) {
    const result = await this.payrollComponentsService.findAll(user, query);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Payroll components retrieved successfully',
      data: result,
    };
  }

  @Query(() => PayrollComponentsQueryResponse)
  @RequirePermissions('Payroll Component:read')
  async activePayrollComponents(
    @Args('businessId', { type: () => Int }) businessId: number,
  ) {
    const components =
      await this.payrollComponentsService.findActiveComponents(businessId);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Active payroll components retrieved successfully',
      data: components,
    };
  }

  @Query(() => PayrollComponentResponse, { name: 'payrollComponentById' })
  @RequirePermissions('Payroll Component:read')
  async payrollComponent(
    @CurrentUser() user: JwtPayload,
    @Args('id', { type: () => Int }) id: number,
  ) {
    const component = await this.payrollComponentsService.findOne(id);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Payroll component retrieved successfully',
      data: component,
    };
  }

  @Query(() => PayrollComponentResponse)
  @RequirePermissions('Payroll Component:read')
  async payrollComponentByCode(
    @Args('code') code: string,
    @Args('businessId', { type: () => Int }) businessId: number,
  ) {
    const component = await this.payrollComponentsService.findByCode(
      code,
      businessId,
    );
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Payroll component retrieved successfully',
      data: component,
    };
  }

  @Mutation(() => PayrollComponentResponse)
  @RequirePermissions('Payroll Component:update')
  async updatePayrollComponent(
    @Args('updatePayrollComponentInput') input: UpdatePayrollComponentInput,
  ) {
    const component = await this.payrollComponentsService.update(input);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Payroll component updated successfully',
      data: component,
    };
  }

  @Mutation(() => PayrollComponentResponse, { name: 'deletePayrollComponent' })
  @RequirePermissions('Payroll Component:delete')
  async removePayrollComponent(@Args('id', { type: () => Int }) id: number) {
    const result = await this.payrollComponentsService.remove(id);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Payroll component deleted successfully',
      data: result,
    };
  }
}
