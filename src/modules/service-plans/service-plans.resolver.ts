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
import { ConsoleLogger, HttpStatus, UseGuards } from '@nestjs/common';
import { PermissionsGuard } from '../permissions/guards/permission.guard';
import { RequirePermissions } from '../permissions/decorators/permissions.decorator';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { JwtPayload } from '../auth/jwt.strategy';
import { CreateServicePlanResponse } from './entities/create-service-plan.response';
import { ServicePlanQueryInput } from './dto/service-plan-query.input';
import { PaginatedServicePlans } from './dto/service-plan-paginated.input';

@Resolver(() => ServicePlan)
export class ServicePlansResolver {
  private readonly logger = new ConsoleLogger(ServicePlansResolver.name);
  constructor(private readonly servicePlansService: ServicePlansService) {}

  // CREATE SERVICE PLAN
  @Mutation(() => CreateServicePlanResponse)
  @UseGuards(PermissionsGuard) // 👈 Use the PermissionsGuard to check permissions
  @RequirePermissions('Service Plan:create') // 👈 Specify the required permission
  @UseGuards(GqlAuthGuard)
  async createServicePlan(
    @Args('createServicePlanInput')
    createServicePlanInput: CreateServicePlanInput,
    @CurrentUser() user: JwtPayload, // 👈 current user from token
  ) {
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

  // ALL SERVICE PLANS
  @UseGuards(GqlAuthGuard)
  @RequirePermissions('Service Plan:read') // 👈 Specify the required permission
  @Query(() => PaginatedServicePlans, { name: 'servicePlans' })
  async findAll(
    @Args('query', { nullable: true })
    query: ServicePlanQueryInput,
  ): Promise<PaginatedServicePlans> {
    return await this.servicePlansService.findAll(query);
  }

  @Query(() => ServicePlan, { name: 'servicePlanById' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.servicePlansService.findOne(id);
  }

  @Mutation(() => ServicePlan)
  updateServicePlan(
    @Args('updateServicePlanInput')
    updateServicePlanInput: UpdateServicePlanInput,
  ) {
    return this.servicePlansService.update(
      updateServicePlanInput.id,
      updateServicePlanInput,
    );
  }

  @Mutation(() => ServicePlan)
  removeServicePlan(@Args('id', { type: () => Int }) id: number) {
    return this.servicePlansService.remove(id);
  }
}
