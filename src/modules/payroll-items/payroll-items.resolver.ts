import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { HttpStatus, UseGuards } from '@nestjs/common';
import { PayrollItemsService } from './payroll-items.service';
import {
  PayrollItem,
  PayrollItemResponse,
  PayrollItemsQueryResponse,
} from './entities/payroll-item.entity';
import { QueryPayrollItemInput, PayrollItemAsPaidInput } from './dto';
import { PermissionsGuard } from '../permissions/guards/permission.guard';
import { RequirePermissions } from '../permissions/decorators/permissions.decorator';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/jwt.strategy';

@Resolver(() => PayrollItem)
@UseGuards(GqlAuthGuard, PermissionsGuard)
export class PayrollItemsResolver {
  constructor(private readonly payrollItemsService: PayrollItemsService) {}

  @Mutation(() => PayrollItemResponse, { name: 'createPayrollItem' })
  @RequirePermissions('Payroll Item:create')
  async createPayrollItem(
    @CurrentUser() user: JwtPayload,
    @Args('userId', { type: () => Int }) userId: number,
    @Args('payrollCycleId', { type: () => Int }) payrollCycleId: number,
  ) {
    const item = await this.payrollItemsService.createPayrollItem({
      user,
      userId,
      payrollCycleId,
    });
    return {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: 'Payroll item created successfully',
      data: item,
    };
  }

  @Mutation(() => PayrollItemResponse, { name: 'previewPayrollItem' })
  @RequirePermissions('Payroll Item:create')
  async previewPayrollItem(
    @CurrentUser() user: JwtPayload,
    @Args('userId', { type: () => Int }) userId: number,
    @Args('payrollCycleId', { type: () => Int }) payrollCycleId: number,
  ) {
    const items = await this.payrollItemsService.previewPayrollItem({
      user,
      userId,
      payrollCycleId,
    });
    //
    return {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: `Previewed payroll items successfully`,
      data: items,
    };
  }

  @Query(() => PayrollItemsQueryResponse, { name: 'payrollItems' })
  @RequirePermissions('Payroll Item:read')
  async payrollItems(
    @CurrentUser() user: JwtPayload,
    @Args('query') query: QueryPayrollItemInput,
  ) {
    const items = await this.payrollItemsService.findAll(user, query);

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Payroll items retrieved successfully',
      data: items,
    };
  }

  @Query(() => PayrollItemResponse, { name: 'payrollItemById' })
  @RequirePermissions('Payroll Item:read')
  async payrollItem(
    @CurrentUser() user: JwtPayload,
    @Args('id', { type: () => Int }) id: number,
  ) {
    const item = await this.payrollItemsService.findOne(user, id);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Payroll item retrieved successfully',
      data: item,
    };
  }

  @Query(() => PayrollItemsQueryResponse, { name: 'payrollItemByUserId' })
  @RequirePermissions('Payroll Item:read')
  async payrollItemByUserId(
    @CurrentUser() user: JwtPayload,
    @Args('payrollCycleId', { type: () => Int }) payrollCycleId: number,
    @Args('userId', { type: () => Int }) userId: number,
  ) {
    const item = await this.payrollItemsService.findByUserId(
      user,
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

  @Mutation(() => PayrollItemResponse, { name: 'approvePayrollItem' })
  @RequirePermissions('Payroll Item:update')
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
  @RequirePermissions('Payroll Item:update')
  async markPayrollItemAsPaid(
    @Args('payrollItemAsPaidInput')
    payrollItemAsPaidInput: PayrollItemAsPaidInput,
  ) {
    const item = await this.payrollItemsService.markAsPaid(
      payrollItemAsPaidInput,
    );
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Payroll item marked as paid',
      data: item,
    };
  }

  // @Mutation(() => PayrollItemResponse, { name: 'updatePayrollItem' })
  // @RequirePermissions('Payroll Item:update')
  // async updatePayrollItem(
  //   @CurrentUser() user: JwtPayload,
  //   @Args('updatePayrollItemInput') input: UpdatePayrollItemInput,
  // ) {
  //   const item = await this.payrollItemsService.update(user, input);
  //   return {
  //     success: true,
  //     statusCode: HttpStatus.OK,
  //     message: 'Payroll item updated successfully',
  //     data: item,
  //   };
  // }

  @Mutation(() => PayrollItemResponse, { name: 'deletePayrollItem' })
  @RequirePermissions('Payroll Item:delete')
  async deletePayrollItem(@Args('id', { type: () => Int }) id: number) {
    const result = await this.payrollItemsService.remove(id);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Payroll item deleted successfully',
      data: result,
    };
  }
}
