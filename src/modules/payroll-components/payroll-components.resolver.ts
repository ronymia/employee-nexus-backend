import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { HttpStatus, UseGuards } from '@nestjs/common';
import { PayrollComponentsService } from './payroll-components.service';
import {
  PayrollComponent,
  PayrollComponentResponse,
  PayrollComponentsQueryResponse,
} from './entities/payroll-component.entity';
import {
  CreatePayrollComponentInput,
  UpdatePayrollComponentInput,
  QueryPayrollComponentInput,
} from './dto';
import { PermissionsGuard } from '../permissions/guards/permission.guard';
import { JwtPayload } from '../auth/jwt.strategy';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';

@Resolver(() => PayrollComponent)
@UseGuards(GqlAuthGuard, PermissionsGuard)
export class PayrollComponentsResolver {
  constructor(
    private readonly payrollComponentsService: PayrollComponentsService,
  ) {}

  @Mutation(() => PayrollComponentResponse, { name: 'createPayrollComponent' })
  // @UseGuards(PermissionsGuard)
  // @RequirePermissions('PayrollComponent:create')
  @UseGuards(GqlAuthGuard)
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
  // @UseGuards(PermissionsGuard)
  // @RequirePermissions('PayrollComponent:read')
  @UseGuards(GqlAuthGuard)
  async payrollComponents(
    @CurrentUser() user: JwtPayload,
    @Args('query', { nullable: true }) query: QueryPayrollComponentInput,
  ) {
    const components = await this.payrollComponentsService.findAll(user, query);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Payroll components retrieved successfully',
      data: components,
    };
  }

  @Query(() => PayrollComponentsQueryResponse)
  @UseGuards(PermissionsGuard)
  // @RequirePermissions('PayrollComponent:read')
  @UseGuards(GqlAuthGuard)
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
  @UseGuards(PermissionsGuard)
  // @RequirePermissions('PayrollComponent:read')
  @UseGuards(GqlAuthGuard)
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
  // @UseGuards(PermissionsGuard)
  // @RequirePermissions('PayrollComponent:read')
  @UseGuards(GqlAuthGuard)
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
  // @UseGuards(PermissionsGuard)
  // @RequirePermissions('PayrollComponent:update')
  @UseGuards(GqlAuthGuard)
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
  // @UseGuards(PermissionsGuard)
  // @RequirePermissions('PayrollComponent:delete')
  @UseGuards(GqlAuthGuard)
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
