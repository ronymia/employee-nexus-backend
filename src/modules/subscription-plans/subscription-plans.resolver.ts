import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SubscriptionPlansService } from './subscription-plans.service';
import {
  SubscriptionPlan,
  SubscriptionPlanQueryResponse,
  SubscriptionPlanResponse,
} from './entities/subscription-plan.entity';
import { CreateSubscriptionPlanInput } from './dto/create-subscription-plan.input';
import { UpdateSubscriptionPlanInput } from './dto/update-subscription-plan.input';
import { HttpStatus, UseGuards } from '@nestjs/common';
import { PermissionsGuard } from '../permissions/guards/permission.guard';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { RequirePermissions } from '../permissions/decorators/permissions.decorator';
import { JwtPayload } from '../auth/jwt.strategy';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { QuerySubscriptionPlanInput } from './dto/query-subscription-plan.input';

@Resolver(() => SubscriptionPlan)
export class SubscriptionPlansResolver {
  constructor(
    private readonly subscriptionPlansService: SubscriptionPlansService,
  ) {}

  //
  @Mutation(() => SubscriptionPlanResponse, { name: 'createSubscriptionPlan' })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Subscription Plan:create')
  @UseGuards(GqlAuthGuard)
  async createSubscriptionPlan(
    @Args('createSubscriptionPlanInput')
    createSubscriptionPlanInput: CreateSubscriptionPlanInput,
    @CurrentUser() user: JwtPayload,
  ): Promise<SubscriptionPlanResponse> {
    const result = await this.subscriptionPlansService.create(
      user,
      createSubscriptionPlanInput,
    );
    // SEND RESPONSE
    return {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: 'Subscription Plan created successfully',
      data: result,
    };
  }
  // FIND ALL
  @Query(() => SubscriptionPlanQueryResponse, { name: 'subscriptionPlans' })
  @UseGuards(GqlAuthGuard)
  @RequirePermissions('Subscription Plan:read')
  async findAll(
    @Args('query', { nullable: true })
    query: QuerySubscriptionPlanInput,
  ) {
    const result = await this.subscriptionPlansService.findAll(query);

    return {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Subscription Plans retrieved successfully',
      meta: result?.meta,
      data: result?.data,
    };
  }

  //
  @Query(() => SubscriptionPlanResponse, { name: 'subscriptionPlanById' })
  @UseGuards(GqlAuthGuard)
  @RequirePermissions('Subscription Plan:read')
  async findOne(@Args('id', { type: () => Int }) id: number) {
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Subscription Plan retrieved successfully',
      data: await this.subscriptionPlansService.findOne(id),
    };
  }

  // UPDATE
  @Mutation(() => SubscriptionPlanResponse, { name: 'updateSubscriptionPlan' })
  @UseGuards(GqlAuthGuard)
  @RequirePermissions('Subscription Plan:update')
  async updateSubscriptionPlan(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateSubscriptionPlanInput')
    updateSubscriptionPlanInput: UpdateSubscriptionPlanInput,
  ) {
    const result = await this.subscriptionPlansService.update(
      id,
      updateSubscriptionPlanInput,
    );

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Subscription Plan updated successfully',
      data: result,
    };
  }

  // DELETE
  @Mutation(() => SubscriptionPlanResponse, { name: 'deleteSubscriptionPlan' })
  @UseGuards(GqlAuthGuard)
  @RequirePermissions('Subscription Plan:delete')
  async removeSubscriptionPlan(@Args('id', { type: () => Int }) id: number) {
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Subscription Plan deleted successfully',
      data: await this.subscriptionPlansService.remove(id),
    };
  }
}
