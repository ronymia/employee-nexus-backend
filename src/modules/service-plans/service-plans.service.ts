/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { ConsoleLogger, Injectable, NotFoundException } from '@nestjs/common';
import { CreateServicePlanInput } from './dto/create-service-plan.input';
import { UpdateServicePlanInput } from './dto/update-service-plan.input';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from '../auth/jwt.strategy';
import { ServicePlanQueryInput } from './dto/service-plan-query.input';
import { paginationHelpers } from 'src/helpers/paginationHelpers';
import { Prisma } from 'generated/prisma';

@Injectable()
export class ServicePlansService {
  private readonly logger = new ConsoleLogger(ServicePlansService.name);
  constructor(private readonly prisma: PrismaService) {}

  // CREATE SERVICE PLAN
  async create(
    user: JwtPayload,
    createServicePlanInput: CreateServicePlanInput,
  ) {
    const { moduleIds, ...rest } = createServicePlanInput;

    return this.prisma.$transaction(async (tx) => {
      // 1. Create service plan
      const servicePlan = await tx.servicePlan.create({
        data: {
          ...rest,
          createdBy: user?.userId,
        },
        include: { creator: true },
      });

      // 2. Connect modules if any
      if (moduleIds?.length) {
        await tx.servicePlanModule.createMany({
          data: moduleIds.map(({ id, isEnabled }) => ({
            servicePlanId: servicePlan.id,
            systemModuleId: id,
            isEnabled,
          })),
          skipDuplicates: true,
        });
      }

      // 3. Return the full service plan with modules included
      const fullServicePlan = await tx.servicePlan.findUnique({
        where: { id: servicePlan.id },
        include: {
          modules: { include: { systemModule: true } },
          creator: true,
        },
      });

      if (!fullServicePlan) {
        throw new NotFoundException('Service Plan not found');
      }

      // 4. Return the full service plan
      return fullServicePlan;
    });
  }

  // FIND ALL SERVICE PLANS
  async findAll(query: ServicePlanQueryInput) {
    const { pagination, ...filters } = query ?? {};

    this.logger.log('Finding all service plans', pagination, filters);

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
    const typedFilters: Prisma.ServicePlanWhereInput = filters;

    const andCondition: Prisma.ServicePlanWhereInput[] = [];

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

    const whereCondition: Prisma.ServicePlanWhereInput = andCondition.length
      ? { AND: andCondition }
      : {};

    const result = limit
      ? await this.prisma.servicePlan.findMany({
          skip,
          take: limit,
          orderBy: {
            [sortBy]: sortOrder,
          },
          where: whereCondition,
        })
      : await this.prisma.servicePlan.findMany({
          orderBy: {
            [sortBy]: sortOrder,
          },
          where: whereCondition,
        });

    // GET TOTAL COUNT
    const totalCount = await this.prisma.servicePlan.count();

    // GET TOTAL COUNT (based on same filters!)
    const paginationTotal = result?.length;

    const totalPages = Math.ceil(totalCount / limit);
    // RETURN
    return {
      meta: {
        page,
        limit,
        skip,
        total: totalCount,
        totalPages,
        paginationTotal,
      },
      data: result,
    };
  }

  async findById(id: number) {
    const existingServicePlan = await this.prisma.servicePlan.findUnique({
      where: { id },
    });

    if (!existingServicePlan) {
      throw new NotFoundException(`Service Plan with ID ${id} does not exist.`);
    }

    return existingServicePlan;
  }

  async update(id: number, updateServicePlanInput: UpdateServicePlanInput) {
    await this.findById(id); // Ensure the service plan exists

    return await this.prisma.servicePlan.update({
      where: { id },
      data: updateServicePlanInput,
    });
  }

  async remove(id: number) {
    await this.findById(id); // Ensure the service plan exists

    return await this.prisma.servicePlan.delete({
      where: { id },
    });
  }
}
