import { ConsoleLogger, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRecruitmentProcessInput } from './dto/create-recruitment-process.input';
import { UpdateRecruitmentProcessInput } from './dto/update-recruitment-process.input';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from '../auth/jwt.strategy';
import { QueryRecruitmentProcessInput } from './dto/query-recruitment-process.input';
import { Prisma } from 'generated/prisma';
import { paginationHelpers } from 'src/helpers/paginationHelpers';
import { recruitmentProcessSearchableFields } from './recruitmentProcess.constant';

@Injectable()
export class RecruitmentProcessesService {
  // PRISMA SERVICE
  constructor(private readonly prisma: PrismaService) {}
  // CONSOLE LOG
  private readonly logger = new ConsoleLogger(RecruitmentProcessesService.name);

  async create({
    user,
    createRecruitmentProcessInput,
  }: {
    user: JwtPayload;
    createRecruitmentProcessInput: CreateRecruitmentProcessInput;
  }) {
    return await this.prisma.recruitmentProcess.create({
      data: {
        ...createRecruitmentProcessInput,
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
    query: QueryRecruitmentProcessInput;
  }) {
    // BUSINESS ID
    const businessId = user.businessId;
    const { pagination, ...filters } = query ?? {};

    // PAGINATION
    const { page, skip, limit, sortBy, sortOrder } =
      paginationHelpers.calculatePagination(pagination || {});

    // FILTER
    const { searchTerm, isRequired } = filters;

    // QUERY BUILDER
    const andCondition: any[] = [];
    // Search in Field
    if (searchTerm) {
      andCondition.push({
        OR: recruitmentProcessSearchableFields.map((field) => ({
          [field]: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        })),
      });
    }
    if (isRequired !== undefined) {
      andCondition.push({ isRequired });
    }
    const whereCondition: Prisma.RecruitmentProcessWhereInput =
      andCondition.length ? { AND: andCondition } : {};

    const result = !limit
      ? await this.prisma.recruitmentProcess.findMany({
          where: {
            businessId,
          },
        })
      : await this.prisma.recruitmentProcess.findMany({
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
    const total = await this.prisma.recruitmentProcess.count({
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
    const result = await this.prisma.recruitmentProcess.findUnique({
      where: { id, businessId },
    });
    if (!result) {
      throw new NotFoundException(
        `Recruitment Process with ID ${id} not found`,
      );
    }

    return result;
  }

  async update({
    user,
    id,
    updateRecruitmentProcessInput,
  }: {
    user: JwtPayload;
    id: number;
    updateRecruitmentProcessInput: UpdateRecruitmentProcessInput;
  }) {
    await this.findOne({ user, id }); // Ensure the recruitment process exists
    return await this.prisma.recruitmentProcess.update({
      where: { id, businessId: user.businessId },
      data: updateRecruitmentProcessInput,
    });
  }
  async remove({ user, id }: { user: JwtPayload; id: number }) {
    await this.findOne({ user, id }); // Ensure the recruitment process exists
    return await this.prisma.recruitmentProcess.delete({
      where: { id, businessId: user.businessId },
    });
  }
}
