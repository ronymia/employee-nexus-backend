// EMPLOYMENT STATUS SERVICE - PROVIDES BUSINESS LOGIC FOR EMPLOYMENT STATUS CRUD OPERATIONS
import { ConsoleLogger, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEmploymentStatusInput } from './dto/create-employment-status.input';
import { UpdateEmploymentStatusInput } from './dto/update-employment-status.input';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from '../auth/jwt.strategy';
import { QueryEmploymentStatusInput } from './dto/query-employment-status.input';
import { Prisma } from 'generated/prisma';
import { paginationHelpers } from 'src/helpers/paginationHelpers';
import { employmentStatusSearchableFields } from './employmentStatus.constant';
import { Status } from 'src/common/enums';

@Injectable()
export class EmploymentStatusService {
  // PRISMA SERVICE INJECTION
  constructor(private readonly prisma: PrismaService) {}
  // CONSOLE LOGGER FOR DEBUGGING
  private readonly logger = new ConsoleLogger(EmploymentStatusService.name);

  // CREATE EMPLOYMENT STATUS - CREATES A NEW EMPLOYMENT STATUS RECORD WITH BUSINESS SCOPING
  async create({
    user,
    createEmploymentStatusInput,
  }: {
    user: JwtPayload;
    createEmploymentStatusInput: CreateEmploymentStatusInput;
  }) {
    return await this.prisma.employmentStatus.create({
      data: {
        ...createEmploymentStatusInput,
        createdBy: user.userId,
        businessId: user.businessId,
        status: Status.ACTIVE,
      },
    });
  }

  // FIND ALL EMPLOYMENT STATUSES - RETRIEVES EMPLOYMENT STATUSES WITH PAGINATION, SEARCH, AND BUSINESS FILTERING
  async findAll({
    user,
    query,
  }: {
    user: JwtPayload;
    query: QueryEmploymentStatusInput;
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
        OR: employmentStatusSearchableFields.map((field) => ({
          [field]: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        })),
      });
    }
    const whereCondition: Prisma.EmploymentStatusWhereInput =
      andCondition.length ? { AND: andCondition } : {};

    const result = !limit
      ? await this.prisma.employmentStatus.findMany({
          where: {
            businessId,
          },
        })
      : await this.prisma.employmentStatus.findMany({
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
    const total = await this.prisma.employmentStatus.count({
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

  // FIND EMPLOYMENT STATUS BY ID - RETRIEVES A SINGLE EMPLOYMENT STATUS WITH BUSINESS VALIDATION
  async findOne({ user, id }: { user: JwtPayload; id: number }) {
    const businessId = user.businessId;
    const result = await this.prisma.employmentStatus.findUnique({
      where: { id, businessId },
    });
    if (!result) {
      throw new NotFoundException(`Employment Status with ID ${id} not found`);
    }

    return result;
  }

  // UPDATE EMPLOYMENT STATUS - MODIFIES AN EXISTING EMPLOYMENT STATUS RECORD
  async update({
    user,
    id,
    updateEmploymentStatusInput,
  }: {
    user: JwtPayload;
    id: number;
    updateEmploymentStatusInput: UpdateEmploymentStatusInput;
  }) {
    await this.findOne({ user, id }); // Ensure the employment status exists
    return await this.prisma.employmentStatus.update({
      where: { id, businessId: user.businessId },
      data: updateEmploymentStatusInput,
    });
  }
  // DELETE EMPLOYMENT STATUS - REMOVES AN EMPLOYMENT STATUS RECORD FROM DATABASE
  async remove({ user, id }: { user: JwtPayload; id: number }) {
    await this.findOne({ user, id }); // Ensure the employment status exists
    return await this.prisma.employmentStatus.delete({
      where: { id, businessId: user.businessId },
    });
  }
}
