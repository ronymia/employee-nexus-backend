import { ConsoleLogger, Injectable, NotFoundException } from '@nestjs/common';
import { CreateJobPlatformInput } from './dto/create-job-platform.input';
import { UpdateJobPlatformInput } from './dto/update-job-platform.input';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from '../auth/jwt.strategy';
import { QueryJobPlatformInput } from './dto/query-job-platform.input';
import { Prisma } from 'generated/prisma';
import { paginationHelpers } from 'src/helpers/paginationHelpers';
import { jobPlatformSearchableFields } from './jobPlatform.constant';

@Injectable()
export class JobPlatformsService {
  // PRISMA SERVICE
  constructor(private readonly prisma: PrismaService) {}
  // CONSOLE LOG
  private readonly logger = new ConsoleLogger(JobPlatformsService.name);

  async create({
    user,
    createJobPlatformInput,
  }: {
    user: JwtPayload;
    createJobPlatformInput: CreateJobPlatformInput;
  }) {
    return await this.prisma.jobPlatform.create({
      data: {
        ...createJobPlatformInput,
        createdBy: user.userId,
        businessId: user.businessId,
      },
    });
  }

  async findAll({
    user,
    query,
  }: {
    user: JwtPayload;
    query: QueryJobPlatformInput;
  }) {
    // BUSINESS ID
    const businessId = user.businessId;
    const { pagination, ...filters } = query ?? {};

    // PAGINATION
    const { page, skip, limit, sortBy, sortOrder } =
      paginationHelpers.calculatePagination(pagination || {});

    // FILTER
    const { searchTerm } = filters;

    // QUERY BUILDER
    const andCondition: any[] = [];
    // Search in Field
    if (searchTerm) {
      andCondition.push({
        OR: jobPlatformSearchableFields.map((field) => ({
          [field]: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        })),
      });
    }
    const whereCondition: Prisma.JobPlatformWhereInput = andCondition.length
      ? { AND: andCondition }
      : {};

    const result = !limit
      ? await this.prisma.jobPlatform.findMany({
          where: {
            businessId,
          },
        })
      : await this.prisma.jobPlatform.findMany({
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
    const total = await this.prisma.jobPlatform.count({
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
    const result = await this.prisma.jobPlatform.findUnique({
      where: { id, businessId },
    });
    if (!result) {
      throw new NotFoundException(`Job Platform with ID ${id} not found`);
    }

    return result;
  }

  async update({
    user,
    id,
    updateJobPlatformInput,
  }: {
    user: JwtPayload;
    id: number;
    updateJobPlatformInput: UpdateJobPlatformInput;
  }) {
    await this.findOne({ user, id }); // Ensure the job platform exists
    return await this.prisma.jobPlatform.update({
      where: { id, businessId: user.businessId },
      data: updateJobPlatformInput,
    });
  }
  async remove({ user, id }: { user: JwtPayload; id: number }) {
    await this.findOne({ user, id }); // Ensure the job platform exists
    return await this.prisma.jobPlatform.delete({
      where: { id, businessId: user.businessId },
    });
  }
}
