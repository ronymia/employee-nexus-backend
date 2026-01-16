import { Injectable, NotAcceptableException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBusinessSubscriptionInput } from './dto/create-business-subscription.input';
import { UpdateBusinessSubscriptionInput } from './dto/update-business-subscription.input';
import { QueryBusinessSubscriptionInput } from './dto/query-business-subscription.input';
import { RenewBusinessSubscriptionInput } from './dto/renew-business-subscription.input';
import { JwtPayload } from '../auth/jwt.strategy';
import { paginationHelpers } from 'src/helpers/paginationHelpers';
import { SubscriptionStatusHelper } from './helpers/subscription-status.helper';
import { BusinessSubscriptionStatus } from 'generated/prisma';

@Injectable()
export class BusinessSubscriptionsService {
  constructor(private readonly prisma: PrismaService) {}

  // CREATE BUSINESS SUBSCRIPTION
  async create({
    createBusinessSubscriptionInput,
  }: {
    user: JwtPayload;
    createBusinessSubscriptionInput: CreateBusinessSubscriptionInput;
  }) {
    const {
      // businessId,
      subscriptionPlanId,
      trialEndDate,
      startDate,
      endDate,
    } = createBusinessSubscriptionInput;

    // Verify business exists
    const business = await this.prisma.business.findUnique({
      where: { id: 1 /* businessId */ },
    });
    if (!business) {
      throw new NotAcceptableException('Business not found');
    }

    // Verify subscription plan exists
    const subscriptionPlan = await this.prisma.subscriptionPlan.findUnique({
      where: { id: subscriptionPlanId },
    });
    if (!subscriptionPlan) {
      throw new NotAcceptableException('Subscription plan not found');
    }

    // Calculate status and isActive from dates
    const { status: calculatedStatus, isActive } =
      SubscriptionStatusHelper.calculateStatus({
        status,
        trialEndDate,
        startDate,
        endDate,
      });

    // Create business subscription
    return await this.prisma.businessSubscription.create({
      data: {
        businessId: 1, // businessId,
        subscriptionPlanId,
        trialEndDate,
        startDate,
        endDate,
        status: calculatedStatus,
        numberOfEmployeesAllowed:
          createBusinessSubscriptionInput.numberOfEmployeesAllowed || 0,
      },
      include: {
        business: true,
        subscriptionPlan: true,
      },
    });
  }

  // FIND ALL BUSINESS SUBSCRIPTIONS
  async findAll({
    user,
    query,
  }: {
    user: JwtPayload;
    query?: QueryBusinessSubscriptionInput;
  }) {
    const businessId = user.businessId;
    const { pagination, ...filters } = query ?? {};

    // PAGINATION
    const { page, skip, limit, sortBy, sortOrder } =
      paginationHelpers.calculatePagination(pagination || {});

    // FILTER
    const { searchTerm, businessId: filterBusinessId, status } = filters;

    // QUERY BUILDER
    const andCondition: any[] = [];

    // Add business ID filter if provided, otherwise use user's businessId
    const targetBusinessId = filterBusinessId || businessId;

    // Add status filter if provided
    if (status) {
      andCondition.push({
        status,
      });
    }

    // Add search functionality if needed
    if (searchTerm) {
      andCondition.push({
        OR: [
          {
            business: {
              name: {
                contains: searchTerm,
                mode: 'insensitive',
              },
            },
          },
        ],
      });
    }

    const whereCondition: any = andCondition.length
      ? { AND: andCondition }
      : {};

    const result = !limit
      ? await this.prisma.businessSubscription.findMany({
          where: {
            businessId: targetBusinessId,
          },
          include: {
            business: true,
            subscriptionPlan: true,
          },
        })
      : await this.prisma.businessSubscription.findMany({
          where: {
            ...whereCondition,
            businessId: targetBusinessId,
          },
          skip,
          take: limit,
          orderBy: {
            [sortBy]: sortOrder,
          },
          include: {
            business: true,
            subscriptionPlan: true,
          },
        });

    // META
    const total = await this.prisma.businessSubscription.count({
      where: {
        businessId: targetBusinessId,
      },
    });

    return {
      meta: {
        page: Number(page),
        limit: Number(limit),
        skip: Number(skip),
        total: Number(total),
        totalPages: Math.ceil(total / limit),
      },
      data: result,
    };
  }

  // FIND ONE BUSINESS SUBSCRIPTION BY ID
  async findOne({ id }: { user: JwtPayload; id: number }) {
    const subscription = await this.prisma.businessSubscription.findUnique({
      where: { id },
      include: {
        business: true,
        subscriptionPlan: true,
      },
    });

    if (!subscription) {
      throw new NotAcceptableException('Business subscription not found');
    }

    return subscription;
  }

  // GET ACTIVE BUSINESS SUBSCRIPTION
  async findActive({
    user,
    businessId,
  }: {
    user: JwtPayload;
    businessId?: number;
  }) {
    const targetBusinessId = businessId || user.businessId;

    return await this.prisma.businessSubscription.findFirst({
      where: {
        businessId: targetBusinessId,
        status: BusinessSubscriptionStatus.ACTIVE,
      },
      include: {
        business: true,
        subscriptionPlan: true,
      },
    });
  }

  // UPDATE BUSINESS SUBSCRIPTION
  async update({
    updateBusinessSubscriptionInput,
  }: {
    user: JwtPayload;
    updateBusinessSubscriptionInput: UpdateBusinessSubscriptionInput;
  }) {
    const { id, trialEndDate, startDate, endDate, status } =
      updateBusinessSubscriptionInput;

    // Verify subscription exists
    const subscription = await this.prisma.businessSubscription.findUnique({
      where: { id },
    });
    if (!subscription) {
      throw new NotAcceptableException('Business subscription not found');
    }

    // Calculate status and isActive from dates
    const { status: calculatedStatus, isActive } =
      SubscriptionStatusHelper.calculateStatus({
        status: status || subscription.status,
        trialEndDate: trialEndDate || subscription.trialEndDate,
        startDate: startDate || subscription.startDate,
        endDate: endDate || subscription.endDate,
      });

    return await this.prisma.businessSubscription.update({
      where: { id },
      data: {
        trialEndDate,
        startDate,
        endDate,
        status: BusinessSubscriptionStatus.ACTIVE,
      },
      include: {
        business: true,
        subscriptionPlan: true,
      },
    });
  }

  // CANCEL BUSINESS SUBSCRIPTION
  async cancel({ user, id }: { user: JwtPayload; id: number }) {
    return await this.update({
      user,
      updateBusinessSubscriptionInput: {
        id,
        status: 'cancelled',
      },
    });
  }

  // RENEW BUSINESS SUBSCRIPTION
  async renew({
    user,
    renewBusinessSubscriptionInput,
  }: {
    user: JwtPayload;
    renewBusinessSubscriptionInput: RenewBusinessSubscriptionInput;
  }) {
    const { id, startDate, endDate } = renewBusinessSubscriptionInput;

    return await this.update({
      user,
      updateBusinessSubscriptionInput: {
        id,
        startDate,
        endDate,
        status: 'active',
      },
    });
  }
}
