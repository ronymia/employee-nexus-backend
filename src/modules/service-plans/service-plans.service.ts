import { ConsoleLogger, Injectable } from '@nestjs/common';
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
    return await this.prisma.servicePlan.create({
      data: { ...createServicePlanInput, createdBy: user?.userId },
      include: {
        creator: true,
      },
    });
  }

  // FIND ALL SERVICE PLANS
  async findAll(query: ServicePlanQueryInput) {
    const { pagination, ...filters } = query;

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

    const result = await this.prisma.servicePlan.findMany({
      skip,
      take: limit,
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

  async findOne(id: number) {
    return await this.prisma.servicePlan.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateServicePlanInput: UpdateServicePlanInput) {
    return await this.prisma.servicePlan.update({
      where: { id },
      data: updateServicePlanInput,
    });
  }

  remove(id: number) {
    return this.prisma.servicePlan.delete({
      where: { id },
    });
  }
}
