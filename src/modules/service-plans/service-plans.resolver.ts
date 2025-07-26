/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ServicePlansService } from './service-plans.service';
import { ServicePlan } from './entities/service-plan.entity';
import { CreateServicePlanInput } from './dto/create-service-plan.input';
import { UpdateServicePlanInput } from './dto/update-service-plan.input';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { HttpStatus, UseGuards } from '@nestjs/common';
import { PermissionsGuard } from '../permissions/guards/permission.guard';
import { RequirePermissions } from '../permissions/decorators/permissions.decorator';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { JwtPayload } from '../auth/jwt.strategy';
import {
  ServicePlanQueryResponse,
  ServicePlanResponse,
} from './entities/service-plan-response.entity';
import { ServicePlanQueryInput } from './dto/service-plan-query.input';

@Resolver(() => ServicePlan)
export class ServicePlansResolver {
  // private readonly logger = new ConsoleLogger(ServicePlansResolver.name);
  constructor(private readonly servicePlansService: ServicePlansService) {}

  // CREATE SERVICE PLAN
  @Mutation(() => ServicePlanResponse)
  @UseGuards(PermissionsGuard) // 👈 Use the PermissionsGuard to check permissions
  @RequirePermissions('Service Plan:create') // 👈 Specify the required permission
  @UseGuards(GqlAuthGuard)
  async createServicePlan(
    @Args('createServicePlanInput')
    createServicePlanInput: CreateServicePlanInput,
    @CurrentUser() user: JwtPayload, // 👈 current user from token
  ): Promise<ServicePlanResponse> {
    const servicePlan = await this.servicePlansService.create(
      user,
      createServicePlanInput,
    );
    // SEND RESPONSE
    return {
      statusCode: HttpStatus.CREATED,
      success: true,
      message: 'Service Plan created successfully',
      data: servicePlan,
    };
  }

  // FIND ALL
  @UseGuards(GqlAuthGuard)
  @RequirePermissions('Service Plan:read') // 👈 Specify the required permission
  @Query(() => ServicePlanQueryResponse, { name: 'servicePlans' })
  async servicePlans(
    @Args('query', { nullable: true })
    query: ServicePlanQueryInput,
  ): Promise<ServicePlanQueryResponse> {
    const result = await this.servicePlansService.findAll(query);

    return {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Service Plans retrieved successfully',
      meta: result.meta,
      data: result.data,
    };
  }

  // FIND BY ID
  @UseGuards(GqlAuthGuard)
  @RequirePermissions('Service Plan:read') // 👈 Specify the required permission
  @Query(() => ServicePlanResponse, { name: 'servicePlanById' })
  async servicePlanById(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<ServicePlanResponse> {
    return {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Service Plan retrieved successfully',
      data: await this.servicePlansService.findById(id),
    };
  }

  // UPDATE ONE
  @UseGuards(GqlAuthGuard)
  @RequirePermissions('Service Plan:update') // 👈 Specify the required permission
  @Mutation(() => ServicePlanResponse)
  async updateServicePlan(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateServicePlanInput')
    updateServicePlanInput: UpdateServicePlanInput,
  ): Promise<ServicePlanResponse> {
    const updatedServicePlan = await this.servicePlansService.update(
      Number(id),
      updateServicePlanInput,
    );

    return {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Service Plan updated successfully',
      data: updatedServicePlan,
    };
  }

  // DELETE ONE
  @UseGuards(GqlAuthGuard)
  @RequirePermissions('Service Plan:delete') // 👈 Specify the required permission
  @Mutation(() => ServicePlanResponse)
  async removeServicePlan(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<ServicePlanResponse> {
    return {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Service Plan deleted successfully',
      data: await this.servicePlansService.remove(id),
    };
  }
}
