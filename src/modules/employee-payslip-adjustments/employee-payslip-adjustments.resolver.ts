import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { HttpStatus, UseGuards } from '@nestjs/common';
import { EmployeePayslipAdjustmentsService } from './employee-payslip-adjustments.service';
import {
  PayslipAdjustment,
  PayslipAdjustmentResponse,
  PayslipAdjustmentsQueryResponse,
} from './entities/payslip-adjustment.entity';
import { PermissionsGuard } from '../permissions/guards/permission.guard';
import { RequirePermissions } from '../permissions/decorators/permissions.decorator';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/jwt.strategy';
import {
  CreatePayslipAdjustmentInput,
  QueryPayslipAdjustmentInput,
  UpdatePayslipAdjustmentInput,
  ApproveRejectPayslipAdjustmentInput,
} from './dto';

@Resolver(() => PayslipAdjustment)
@UseGuards(GqlAuthGuard, PermissionsGuard)
export class EmployeePayslipAdjustmentsResolver {
  constructor(
    private readonly employeePayslipAdjustmentsService: EmployeePayslipAdjustmentsService,
  ) {}

  // CREATE PAYSLIP ADJUSTMENT
  @Mutation(() => PayslipAdjustmentResponse, {
    name: 'createPayslipAdjustment',
  })
  @RequirePermissions('Payroll:create')
  async createPayslipAdjustment(
    @CurrentUser() user: JwtPayload,
    @Args('createPayslipAdjustmentInput')
    createPayslipAdjustmentInput: CreatePayslipAdjustmentInput,
  ) {
    const result = await this.employeePayslipAdjustmentsService.create({
      user,
      input: createPayslipAdjustmentInput,
    });
    return {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: 'Payslip adjustment created successfully',
      data: result,
    };
  }

  // UPDATE PAYSLIP ADJUSTMENT
  @Mutation(() => PayslipAdjustmentResponse, {
    name: 'updatePayslipAdjustment',
  })
  @RequirePermissions('Payroll:update')
  async updatePayslipAdjustment(
    @CurrentUser() user: JwtPayload,
    @Args('updatePayslipAdjustmentInput')
    updatePayslipAdjustmentInput: UpdatePayslipAdjustmentInput,
  ) {
    const result = await this.employeePayslipAdjustmentsService.update({
      user,
      input: updatePayslipAdjustmentInput,
    });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Payslip adjustment updated successfully',
      data: result,
    };
  }

  // APPROVE OR REJECT PAYSLIP ADJUSTMENT
  @Mutation(() => PayslipAdjustmentResponse, {
    name: 'approveRejectPayslipAdjustment',
  })
  @RequirePermissions('Payroll:update')
  async approveRejectPayslipAdjustment(
    @CurrentUser() user: JwtPayload,
    @Args('approveRejectPayslipAdjustmentInput')
    approveRejectPayslipAdjustmentInput: ApproveRejectPayslipAdjustmentInput,
  ) {
    const result = await this.employeePayslipAdjustmentsService.approveReject({
      user,
      input: approveRejectPayslipAdjustmentInput,
    });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Payslip adjustment status updated successfully',
      data: result,
    };
  }

  // GET ALL PAYSLIP ADJUSTMENTS
  @Query(() => PayslipAdjustmentsQueryResponse, {
    name: 'payslipAdjustments',
  })
  @RequirePermissions('Payroll:read')
  async findAll(
    @CurrentUser() user: JwtPayload,
    @Args('query', { nullable: true })
    query?: QueryPayslipAdjustmentInput,
  ) {
    const result = await this.employeePayslipAdjustmentsService.findAll({
      user,
      query,
    });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Payslip adjustments retrieved successfully',
      data: result,
    };
  }

  // GET ONE PAYSLIP ADJUSTMENT
  @Query(() => PayslipAdjustmentResponse, {
    name: 'payslipAdjustment',
  })
  @RequirePermissions('Payroll:read')
  async findOne(
    @CurrentUser() user: JwtPayload,
    @Args('id', { type: () => Int }) id: number,
  ) {
    const result = await this.employeePayslipAdjustmentsService.findOne({
      user,
      id,
    });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Payslip adjustment retrieved successfully',
      data: result,
    };
  }

  // GET PENDING PAYSLIP ADJUSTMENTS
  @Query(() => PayslipAdjustmentsQueryResponse, {
    name: 'pendingPayslipAdjustments',
  })
  @RequirePermissions('Payroll:read')
  async pendingAdjustments(
    @CurrentUser() user: JwtPayload,
    @Args('query', { nullable: true })
    query?: QueryPayslipAdjustmentInput,
  ) {
    const result =
      await this.employeePayslipAdjustmentsService.pendingAdjustments({
        user,
        query,
      });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Pending payslip adjustments retrieved successfully',
      data: result,
    };
  }

  // GET APPROVED PAYSLIP ADJUSTMENTS
  @Query(() => PayslipAdjustmentsQueryResponse, {
    name: 'approvedPayslipAdjustments',
  })
  @RequirePermissions('Payroll:read')
  async approvedAdjustments(
    @CurrentUser() user: JwtPayload,
    @Args('query', { nullable: true })
    query?: QueryPayslipAdjustmentInput,
  ) {
    const result =
      await this.employeePayslipAdjustmentsService.approvedAdjustments({
        user,
        query,
      });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Approved payslip adjustments retrieved successfully',
      data: result,
    };
  }
}
