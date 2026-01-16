import { ConsoleLogger, Injectable, NotFoundException } from '@nestjs/common';
import { CreateWorkSiteInput } from './dto/create-work-site.input';
import { UpdateWorkSiteInput } from './dto/update-work-site.input';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from '../auth/jwt.strategy';
import { QueryWorkSiteInput } from './dto/query-work-site.input';
import { Prisma } from 'generated/prisma';
import { paginationHelpers } from 'src/helpers/paginationHelpers';
import { workSiteSearchableFields } from './workSite.constant';
import { Status } from 'src/common/enums';

@Injectable()
export class WorkSitesService {
  // PRISMA SERVICE
  constructor(private readonly prisma: PrismaService) {}
  // CONSOLE LOG
  private readonly logger = new ConsoleLogger(WorkSitesService.name);

  async create({
    user,
    createWorkSiteInput,
  }: {
    user: JwtPayload;
    createWorkSiteInput: CreateWorkSiteInput;
  }) {
    return await this.prisma.workSite.create({
      data: {
        ...createWorkSiteInput,
        businessId: user.businessId,
        status: Status.ACTIVE,
      },
    });
  }

  async findAll({
    user,
    query,
  }: {
    user: JwtPayload;
    query: QueryWorkSiteInput;
  }) {
    // BUSINESS ID
    const businessId = user.businessId;
    const { pagination, ...filters } = query ?? {};

    // PAGINATION
    const { page, skip, limit, sortBy, sortOrder } =
      paginationHelpers.calculatePagination(pagination || {});

    // FILTER
    const { searchTerm, address, locationTrackingType, maxRadius, ipAddress } =
      filters;

    // QUERY BUILDER
    const andCondition: any[] = [];
    // Search in Field
    if (searchTerm) {
      andCondition.push({
        OR: workSiteSearchableFields.map((field) => ({
          [field]: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        })),
      });
    }
    if (address !== undefined) {
      andCondition.push({ address });
    }
    if (locationTrackingType !== undefined) {
      andCondition.push({ locationTrackingType });
    }
    if (maxRadius !== undefined) {
      andCondition.push({ maxRadius });
    }
    if (ipAddress !== undefined) {
      andCondition.push({ ipAddress });
    }
    const whereCondition: Prisma.WorkSiteWhereInput = andCondition.length
      ? { AND: andCondition }
      : {};

    const result = !limit
      ? await this.prisma.workSite.findMany({
          where: {
            businessId,
          },
        })
      : await this.prisma.workSite.findMany({
          where: {
            ...whereCondition,
            businessId,
          },
          skip,
          take: limit,
          orderBy: {
            [sortBy]: sortOrder,
          },
        });
    // this.logger.log(result);

    // META
    const total = await this.prisma.workSite.count({
      where: {
        businessId,
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

  async findOne({ user, id }: { user: JwtPayload; id: number }) {
    const businessId = user.businessId;
    const result = await this.prisma.workSite.findUnique({
      where: { id, businessId },
    });
    if (!result) {
      throw new NotFoundException(`Work Site with ID ${id} not found`);
    }

    return result;
  }

  async update({
    user,
    id,
    updateWorkSiteInput,
  }: {
    user: JwtPayload;
    id: number;
    updateWorkSiteInput: UpdateWorkSiteInput;
  }) {
    await this.findOne({ user, id }); // Ensure the work site exists
    return await this.prisma.workSite.update({
      where: { id, businessId: user.businessId },
      data: updateWorkSiteInput,
    });
  }
  async isDefault({
    workSiteId,
    businessId,
  }: {
    workSiteId: number;
    businessId: number;
  }): Promise<boolean> {
    const systemDefaults = await this.prisma.systemDefaults.findUnique({
      where: { businessId },
      select: { defaultWorkSiteId: true },
    });

    return systemDefaults?.defaultWorkSiteId === workSiteId;
  }

  async remove({ user, id }: { user: JwtPayload; id: number }) {
    await this.findOne({ user, id }); // Ensure the work site exists
    return await this.prisma.workSite.delete({
      where: { id, businessId: user.businessId },
    });
  }
}
