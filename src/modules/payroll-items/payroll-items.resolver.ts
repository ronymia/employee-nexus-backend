import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { HttpStatus, UseGuards } from '@nestjs/common';
import { PayrollItemsService } from './payroll-items.service';
import {
  PayrollItem,
  PayrollItemResponse,
  PayrollItemsQueryResponse,
} from './entities/payroll-item.entity';
import {
  CreatePayrollItemInput,
  QueryPayrollItemInput,
  AddPayslipAdjustmentInput,
  GeneratePayrollItemsInput,
} from './dto';
import { PermissionsGuard } from '../permissions/guards/permission.guard';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/jwt.strategy';

@Resolver(() => PayrollItem)
@UseGuards(GqlAuthGuard, PermissionsGuard)
export class PayrollItemsResolver {
  constructor(private readonly payrollItemsService: PayrollItemsService) {}

  @Mutation(() => PayrollItemResponse, { name: 'createPayrollItem' })
  // @RequirePermissions('PayrollItem:create')
  async createPayrollItem(
    @CurrentUser() user: JwtPayload,
    @Args('createPayrollItemInput') input: CreatePayrollItemInput,
  ) {
    const item = await this.payrollItemsService.create(user, input);
    return {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: 'Payroll item created successfully',
      data: item,
    };
  }

  @Mutation(() => PayrollItemsQueryResponse, { name: 'generatePayrollItems' })
  // @RequirePermissions('PayrollItem:create')
  async generatePayrollItems(
    @CurrentUser() user: JwtPayload,
    @Args('generatePayrollItemsInput') input: GeneratePayrollItemsInput,
  ) {
    const items = await this.payrollItemsService.generatePayrollItems(
      user,
      input,
    );
    return {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: `Generated ${items.length} payroll items successfully`,
      data: items,
    };
  }

  @Query(() => PayrollItemsQueryResponse, { name: 'payrollItems' })
  // @RequirePermissions('PayrollItem:read')
  async payrollItems(@Args('query') query: QueryPayrollItemInput) {
    const items = await this.payrollItemsService.findAll(query);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Payroll items retrieved successfully',
      data: items,
    };
  }

  @Query(() => PayrollItemResponse, { name: 'payrollItemById' })
  // @RequirePermissions('PayrollItem:read')
  async payrollItem(@Args('id', { type: () => Int }) id: number) {
    const item = await this.payrollItemsService.findOne(id);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Payroll item retrieved successfully',
      data: item,
    };
  }

  @Query(() => PayrollItemResponse, { name: 'payrollItemByUserId' })
  // @RequirePermissions('PayrollItem:read')
  async payrollItemByUserId(
    @Args('payrollCycleId', { type: () => Int }) payrollCycleId: number,
    @Args('userId', { type: () => Int }) userId: number,
  ) {
    const item = await this.payrollItemsService.findByUserId(
      payrollCycleId,
      userId,
    );
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Payroll item retrieved successfully',
      data: item,
    };
  }

  @Mutation(() => PayrollItemResponse, { name: 'addPayslipAdjustment' })
  // @RequirePermissions('PayrollItem:update')
  async addPayslipAdjustment(
    @CurrentUser() user: JwtPayload,
    @Args('addPayslipAdjustmentInput') input: AddPayslipAdjustmentInput,
  ) {
    await this.payrollItemsService.addAdjustment(user, input);
    const item = await this.payrollItemsService.findOne(input.payrollItemId);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Payslip adjustment added successfully',
      data: item,
    };
  }

  @Mutation(() => PayrollItemResponse, { name: 'approvePayrollItem' })
  // @RequirePermissions('PayrollItem:approve')
  async approvePayrollItem(@Args('id', { type: () => Int }) id: number) {
    const item = await this.payrollItemsService.approve(id);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Payroll item approved successfully',
      data: item,
    };
  }

  @Mutation(() => PayrollItemResponse, { name: 'markPayrollItemAsPaid' })
  // @RequirePermissions('PayrollItem:update')
  async markPayrollItemAsPaid(
    @Args('id', { type: () => Int }) id: number,
    @Args('paymentMethod') paymentMethod: string,
    @Args('transactionRef', { nullable: true }) transactionRef?: string,
  ) {
    const item = await this.payrollItemsService.markAsPaid(
      id,
      paymentMethod,
      transactionRef,
    );
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Payroll item marked as paid',
      data: item,
    };
  }
}
