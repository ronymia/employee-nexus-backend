/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ConsoleLogger, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubscriptionPlanInput } from './dto/create-subscription-plan.input';
import { UpdateSubscriptionPlanInput } from './dto/update-subscription-plan.input';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from '../auth/jwt.strategy';
import { Prisma } from 'generated/prisma';
import { QuerySubscriptionPlanInput } from './dto/query-subscription-plan.input';
import { paginationHelpers } from 'src/helpers/paginationHelpers';

@Injectable()
export class SubscriptionPlansService {
  private readonly logger = new ConsoleLogger(SubscriptionPlansService.name);
  constructor(private readonly prisma: PrismaService) {}

  // CREATE SUBSCRIPTION PLAN
  async create(
    user: JwtPayload,
    createSubscriptionPlanInput: CreateSubscriptionPlanInput,
  ): Promise<any> {
    const { featureIds, ...rest } = createSubscriptionPlanInput;

    return this.prisma.$transaction(
      async (prismaTransaction: Prisma.TransactionClient) => {
        // 1. check modules
        if (featureIds?.length) {
          const existingFeatures = await prismaTransaction.feature.findMany({
            where: { id: { in: featureIds } },
          });

          if (existingFeatures.length !== featureIds.length) {
            const foundIds = existingFeatures.map((m) => m?.id);
            const missing = featureIds.filter(
              (id: number) => !foundIds.includes(id),
            );
            throw new NotFoundException(
              `Feature not found: ${missing.join(', ')}`,
            );
          }
        }

        // 2. Create subscription plan
        const newSubscriptionPlan =
          await prismaTransaction.subscriptionPlan.create({
            data: {
              ...rest,
              status: 'ACTIVE',
            },
          });

        // if subscription plan not created
        if (!newSubscriptionPlan) {
          throw new NotFoundException('Subscription Plan not found');
        }

        // 3. Connect modules if any
        if (featureIds?.length) {
          await prismaTransaction.subscriptionPlanFeature.createMany({
            data: featureIds.map((id) => ({
              subscriptionPlanId: newSubscriptionPlan.id,
              featureId: id,
            })),
            skipDuplicates: true,
          });
        }

        // 4. Return the full subscription plan with modules included
        const fullSubscriptionPlan =
          await prismaTransaction.subscriptionPlan.findUnique({
            where: { id: newSubscriptionPlan.id },
            include: {
              features: { include: { feature: true } },
            },
          });

        if (!fullSubscriptionPlan) {
          throw new NotFoundException('Service Plan not found');
        }

        // Return the full service plan
        return fullSubscriptionPlan;
      },
    );
  }

  // FIND ALL SUBSCRIPTION PLANS
  async findAll(query: QuerySubscriptionPlanInput) {
    const { pagination, ...filters } = query ?? {};

    // this.logger.log('Finding all service plans', pagination, filters);

    // PAGINATION
    const { page, skip, limit, sortBy, sortOrder } =
      paginationHelpers.calculatePagination(pagination || {});

    // FILTER
    // const { searchTerm, ...filtersData } = filters;

    // QUERY BUILDER

    // Search in Field
    // if (searchTerm) {
    //   andCondition.push({
    //     OR: academicDepartmentSearchableFields.map((field) => ({
    //       [field]: {
    //         contains: searchTerm,
    //         mode: 'insensitive',
    //       },
    //     })),
    //   });
    // }

    // field Filtering
    // Explicitly type the filters
    const typedFilters: Prisma.SubscriptionPlanWhereInput = filters;

    const andCondition: Prisma.SubscriptionPlanWhereInput[] = [];

    if (Object.keys(typedFilters).length > 0) {
      const filterConditions = Object.entries(typedFilters)
        .filter(
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          ([_, value]) => value !== undefined && value !== null && value !== '',
        )
        .map(([field, value]) => ({
          [field]: { equals: value },
        }));

      if (filterConditions.length > 0) {
        andCondition.push({ AND: filterConditions });
      }
    }

    const whereCondition: Prisma.SubscriptionPlanWhereInput =
      andCondition.length ? { AND: andCondition } : {};

    const result = limit
      ? await this.prisma.subscriptionPlan.findMany({
          skip,
          take: limit,
          orderBy: {
            [sortBy]: sortOrder,
          },
          where: whereCondition,
        })
      : await this.prisma.subscriptionPlan.findMany({
          orderBy: {
            [sortBy]: sortOrder,
          },
          where: whereCondition,
        });

    // GET TOTAL COUNT
    const totalCount = await this.prisma.subscriptionPlan.count();

    // GET TOTAL COUNT (based on same filters!)
    // const paginationTotal = result?.length;

    const totalPages = Math.ceil(totalCount / limit);
    // RETURN
    return {
      meta: {
        page,
        limit,
        skip,
        total: totalCount,
        totalPages,
        // paginationTotal,
      },
      data: result,
    };
  }

  async findOne(id: number): Promise<any> {
    const existingServicePlan = await this.prisma.subscriptionPlan.findUnique({
      where: { id },
    });

    if (!existingServicePlan) {
      throw new NotFoundException(
        `Subscription Plan with ID ${id} does not exist.`,
      );
    }

    return existingServicePlan;
  }

  async update(
    id: number,
    updateSubscriptionPlanInput: UpdateSubscriptionPlanInput,
  ): Promise<any> {
    await this.findOne(id); // Ensure the subscription plan exists
    const { featureIds, ...rest } = updateSubscriptionPlanInput;
    // return await this.prisma.subscriptionPlan.update({
    //   where: { id },
    //   data: updateSubscriptionPlanInput,
    // });

    return this.prisma.$transaction(async (prismaTransaction) => {
      // 1. check modules
      if (featureIds?.length) {
        const existingFeatures = await prismaTransaction.feature.findMany({
          where: { id: { in: featureIds } },
        });

        if (existingFeatures.length !== featureIds.length) {
          const foundIds = existingFeatures.map((m) => m?.id);
          const missing = featureIds.filter((id) => !foundIds.includes(id));
          throw new NotFoundException(
            `Feature not found: ${missing.join(', ')}`,
          );
        }
      }

      // 2. update subscription plan
      await prismaTransaction.subscriptionPlan.update({
        where: { id },
        data: rest,
      });

      // 3. update modules
      await prismaTransaction.subscriptionPlanFeature.deleteMany({
        where: { subscriptionPlanId: id },
      });

      if (featureIds?.length) {
        await prismaTransaction.subscriptionPlanFeature.createMany({
          data: featureIds.map((id) => ({
            subscriptionPlanId: id,
            featureId: id,
          })),
          skipDuplicates: true,
        });
      }

      // 4. return
      return await prismaTransaction.subscriptionPlan.findUnique({
        where: { id },
        include: {
          features: true,
        },
      });
    });
  }

  async remove(id: number): Promise<any> {
    await this.findOne(id); // Ensure the subscription plan exists

    return this.prisma.$transaction(async (prismaTransaction) => {
      // 1. delete modules
      await prismaTransaction.subscriptionPlanFeature.deleteMany({
        where: { subscriptionPlanId: id },
      });

      // 2. delete subscription plan
      return await prismaTransaction.subscriptionPlan.delete({
        where: { id },
      });
    });
  }
}
