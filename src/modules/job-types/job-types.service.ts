import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateJobTypeInput } from './dto/create-job-type.input';
import { UpdateJobTypeInput } from './dto/update-job-type.input';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from '../auth/jwt.strategy';
import { QueryJobTypeInput } from './dto/query-job-type.input';
import { Prisma } from 'generated/prisma';
import { paginationHelpers } from 'src/helpers/paginationHelpers';
import { jobTypeSearchableFields } from './jobType.constant';
import { Status } from 'src/common/enums';

@Injectable()
export class JobTypesService {
  // PRISMA SERVICE
  constructor(private readonly prisma: PrismaService) {}

  async create({
    user,
    createJobTypeInput,
  }: {
    user: JwtPayload;
    createJobTypeInput: CreateJobTypeInput;
  }) {
    return await this.prisma.jobType.create({
      data: {
        ...createJobTypeInput,
        createdBy: user.userId,
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
    query: QueryJobTypeInput;
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
        OR: jobTypeSearchableFields.map((field) => ({
          [field]: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        })),
      });
    }
    const whereCondition: Prisma.JobTypeWhereInput = andCondition.length
      ? { AND: andCondition }
      : {};

    const result = !limit
      ? await this.prisma.jobType.findMany({
          where: {
            businessId,
          },
        })
      : await this.prisma.jobType.findMany({
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
    const total = await this.prisma.jobType.count({
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
    const result = await this.prisma.jobType.findUnique({
      where: { id, businessId },
    });
    if (!result) {
      throw new NotFoundException(`Job Type with ID ${id} not found`);
    }

    return result;
  }

  async update({
    user,
    id,
    updateJobTypeInput,
  }: {
    user: JwtPayload;
    id: number;
    updateJobTypeInput: UpdateJobTypeInput;
  }) {
    await this.findOne({ user, id }); // Ensure the job type exists
    return await this.prisma.jobType.update({
      where: { id, businessId: user.businessId },
      data: updateJobTypeInput,
    });
  }
  async remove({ user, id }: { user: JwtPayload; id: number }) {
    await this.findOne({ user, id }); // Ensure the job type exists
    return await this.prisma.jobType.delete({
      where: { id, businessId: user.businessId },
    });
  }
}
