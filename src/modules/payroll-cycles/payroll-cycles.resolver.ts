import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { HttpStatus, UseGuards } from '@nestjs/common';
import { PayrollCyclesService } from './payroll-cycles.service';
import {
  PayrollCycle,
  PayrollCycleResponse,
  PayrollCyclesQueryResponse,
} from './entities/payroll-cycle.entity';
import {
  CreatePayrollCycleInput,
  QueryPayrollCycleInput,
  ApprovePayrollCycleInput,
  ProcessPayrollCycleInput,
} from './dto';
import { PermissionsGuard } from '../permissions/guards/permission.guard';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/jwt.strategy';

@Resolver(() => PayrollCycle)
@UseGuards(GqlAuthGuard, PermissionsGuard)
export class PayrollCyclesResolver {
  constructor(private readonly payrollCyclesService: PayrollCyclesService) {}

  @Mutation(() => PayrollCycleResponse, { name: 'createPayrollCycle' })
  // @RequirePermissions('PayrollCycle:create')
  async createPayrollCycle(
    @CurrentUser() user: JwtPayload,
    @Args('createPayrollCycleInput') input: CreatePayrollCycleInput,
  ) {
    const cycle = await this.payrollCyclesService.create(user, input);
    return {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: 'Payroll cycle created successfully',
      data: cycle,
    };
  }

  @Query(() => PayrollCyclesQueryResponse, { name: 'payrollCycles' })
  // @RequirePermissions('PayrollCycle:read')
  async payrollCycles(
    @CurrentUser() user: JwtPayload,
    @Args('query', { nullable: true }) query: QueryPayrollCycleInput,
  ) {
    const cycles = await this.payrollCyclesService.findAll(user, query);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Payroll cycles retrieved successfully',
      data: cycles,
    };
  }

  @Query(() => PayrollCycleResponse, { name: 'payrollCycleById' })
  // @RequirePermissions('PayrollCycle:read')
  async payrollCycle(@Args('id', { type: () => Int }) id: number) {
    const cycle = await this.payrollCyclesService.findOne(id);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Payroll cycle retrieved successfully',
      data: cycle,
    };
  }

  @Mutation(() => PayrollCycleResponse, { name: 'approvePayrollCycle' })
  // @RequirePermissions('PayrollCycle:approve')
  async approvePayrollCycle(
    @Args('approvePayrollCycleInput') input: ApprovePayrollCycleInput,
  ) {
    const cycle = await this.payrollCyclesService.approve(input);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Payroll cycle approved successfully',
      data: cycle,
    };
  }

  @Mutation(() => PayrollCycleResponse, { name: 'processPayrollCycle' })
  // @RequirePermissions('PayrollCycle:process')
  async processPayrollCycle(
    @Args('processPayrollCycleInput') input: ProcessPayrollCycleInput,
  ) {
    const cycle = await this.payrollCyclesService.process(input);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Payroll cycle processing started',
      data: cycle,
    };
  }

  @Mutation(() => PayrollCycleResponse, { name: 'markPayrollCycleAsPaid' })
  // @RequirePermissions('PayrollCycle:update')
  async markPayrollCycleAsPaid(@Args('id', { type: () => Int }) id: number) {
    const cycle = await this.payrollCyclesService.markAsPaid(id);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Payroll cycle marked as paid',
      data: cycle,
    };
  }

  @Mutation(() => PayrollCycleResponse, { name: 'cancelPayrollCycle' })
  // @RequirePermissions('PayrollCycle:delete')
  async cancelPayrollCycle(@Args('id', { type: () => Int }) id: number) {
    const cycle = await this.payrollCyclesService.cancel(id);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Payroll cycle cancelled',
      data: cycle,
    };
  }
}
