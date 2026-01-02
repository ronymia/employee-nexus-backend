import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { BusinessSubscriptionsService } from './business-subscriptions.service';
import {
  BusinessSubscription,
  BusinessSubscriptionResponse,
  BusinessSubscriptionsQueryResponse,
} from './entities/business-subscription.entity';
import { CreateBusinessSubscriptionInput } from './dto/create-business-subscription.input';
import { UpdateBusinessSubscriptionInput } from './dto/update-business-subscription.input';
import { QueryBusinessSubscriptionInput } from './dto/query-business-subscription.input';
import { RenewBusinessSubscriptionInput } from './dto/renew-business-subscription.input';
import { HttpStatus, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { PermissionsGuard } from '../permissions/guards/permission.guard';
import { RequirePermissions } from '../permissions/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/jwt.strategy';

@Resolver(() => BusinessSubscription)
export class BusinessSubscriptionsResolver {
  constructor(
    private readonly businessSubscriptionsService: BusinessSubscriptionsService,
  ) {}

  // CREATE BUSINESS SUBSCRIPTION
  @Mutation(() => BusinessSubscriptionResponse, {
    name: 'createBusinessSubscription',
  })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('BusinessSubscription:create')
  @UseGuards(GqlAuthGuard)
  async createBusinessSubscription(
    @Args('createBusinessSubscriptionInput')
    createBusinessSubscriptionInput: CreateBusinessSubscriptionInput,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.businessSubscriptionsService.create({
      user,
      createBusinessSubscriptionInput,
    });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Business subscription created successfully`,
      data: result,
    };
  }

  // FIND ALL BUSINESS SUBSCRIPTIONS
  @Query(() => BusinessSubscriptionsQueryResponse, {
    name: 'businessSubscriptions',
  })
  @UseGuards(PermissionsGuard)
  // @RequirePermissions('BusinessSubscription:read')
  @UseGuards(GqlAuthGuard)
  async findAll(
    @CurrentUser() user: JwtPayload,
    @Args('query', { nullable: true }) query: QueryBusinessSubscriptionInput,
  ) {
    const result = await this.businessSubscriptionsService.findAll({
      user,
      query,
    });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Business subscriptions retrieved successfully`,
      meta: result?.meta,
      data: result?.data,
    };
  }

  // FIND ONE BUSINESS SUBSCRIPTION
  @Query(() => BusinessSubscriptionResponse, {
    name: 'businessSubscriptionById',
  })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('BusinessSubscription:read')
  @UseGuards(GqlAuthGuard)
  async findOne(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.businessSubscriptionsService.findOne({
      user,
      id,
    });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Business subscription retrieved successfully`,
      data: result,
    };
  }

  // GET ACTIVE BUSINESS SUBSCRIPTION
  @Query(() => BusinessSubscriptionResponse, {
    name: 'activeBusinessSubscription',
  })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('BusinessSubscription:read')
  @UseGuards(GqlAuthGuard)
  async findActive(
    @CurrentUser() user: JwtPayload,
    @Args('businessId', { type: () => Int, nullable: true })
    businessId?: number,
  ) {
    const result = await this.businessSubscriptionsService.findActive({
      user,
      businessId,
    });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Active business subscription retrieved successfully`,
      data: result,
    };
  }

  // UPDATE BUSINESS SUBSCRIPTION
  @Mutation(() => BusinessSubscriptionResponse, {
    name: 'updateBusinessSubscription',
  })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('BusinessSubscription:update')
  @UseGuards(GqlAuthGuard)
  async updateBusinessSubscription(
    @CurrentUser() user: JwtPayload,
    @Args('updateBusinessSubscriptionInput')
    updateBusinessSubscriptionInput: UpdateBusinessSubscriptionInput,
  ) {
    const result = await this.businessSubscriptionsService.update({
      user,
      updateBusinessSubscriptionInput,
    });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Business subscription updated successfully`,
      data: result,
    };
  }

  // CANCEL BUSINESS SUBSCRIPTION
  @Mutation(() => BusinessSubscriptionResponse, {
    name: 'cancelBusinessSubscription',
  })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('BusinessSubscription:update')
  @UseGuards(GqlAuthGuard)
  async cancelBusinessSubscription(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.businessSubscriptionsService.cancel({
      user,
      id,
    });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Business subscription cancelled successfully`,
      data: result,
    };
  }

  // RENEW BUSINESS SUBSCRIPTION
  @Mutation(() => BusinessSubscriptionResponse, {
    name: 'renewBusinessSubscription',
  })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('BusinessSubscription:update')
  @UseGuards(GqlAuthGuard)
  async renewBusinessSubscription(
    @CurrentUser() user: JwtPayload,
    @Args('renewBusinessSubscriptionInput')
    renewBusinessSubscriptionInput: RenewBusinessSubscriptionInput,
  ) {
    const result = await this.businessSubscriptionsService.renew({
      user,
      renewBusinessSubscriptionInput,
    });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Business subscription renewed successfully`,
      data: result,
    };
  }
}
