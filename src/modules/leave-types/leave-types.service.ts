// LEAVE TYPES SERVICE - PROVIDES BUSINESS LOGIC FOR LEAVE TYPE CRUD OPERATIONS
import { ConsoleLogger, Injectable, NotFoundException } from '@nestjs/common';
import { CreateLeaveTypeInput } from './dto/create-leave-type.input';
import { UpdateLeaveTypeInput } from './dto/update-leave-type.input';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from '../auth/jwt.strategy';
import { QueryLeaveTypeInput } from './dto/query-leave-type.input';
import { Prisma } from 'generated/prisma';
import { paginationHelpers } from 'src/helpers/paginationHelpers';
import { leaveTypeSearchableFields } from './leaveType.constant';

@Injectable()
export class LeaveTypesService {
  // PRISMA SERVICE INJECTION
  constructor(private readonly prisma: PrismaService) {}
  // CONSOLE LOGGER FOR DEBUGGING
  private readonly logger = new ConsoleLogger(LeaveTypesService.name);

  // CREATE LEAVE TYPE - CREATES A NEW LEAVE TYPE RECORD WITH BUSINESS SCOPING
  async create({
    user,
    createLeaveTypeInput,
  }: {
    user: JwtPayload;
    createLeaveTypeInput: CreateLeaveTypeInput;
  }) {
    const { employmentStatuses, ...leaveTypeData } = createLeaveTypeInput;

    // VALIDATE EMPLOYMENT STATUS IDS IF PROVIDED
    if (employmentStatuses && employmentStatuses.length > 0) {
      const existingEmploymentStatuses =
        await this.prisma.employmentStatus.findMany({
          where: {
            id: { in: employmentStatuses },
            businessId: user.businessId,
          },
          select: { id: true },
        });

      const existingIds = existingEmploymentStatuses.map((es) => es.id);
      const invalidIds = employmentStatuses.filter(
        (id) => !existingIds.includes(id),
      );

      if (invalidIds.length > 0) {
        throw new NotFoundException(
          `Employment Status(es) with ID(s) ${invalidIds.join(', ')} not found or do not belong to your business`,
        );
      }
    }

    const leaveType = await this.prisma.leaveType.create({
      data: {
        ...leaveTypeData,
        createdBy: user.userId,
        businessId: user.businessId,
      },
    });

    // CREATE EMPLOYMENT STATUS RELATIONSHIPS IF PROVIDED
    if (employmentStatuses && employmentStatuses.length > 0) {
      const employmentStatusData = employmentStatuses.map(
        (employmentStatusId) => ({
          leaveTypeId: leaveType.id,
          employmentStatusId,
        }),
      );

      await this.prisma.leaveTypeEmploymentStatus.createMany({
        data: employmentStatusData,
      });
    }

    // RETURN LEAVE TYPE WITH EMPLOYMENT STATUSES
    return await this.prisma.leaveType
      .findUnique({
        where: { id: leaveType.id },
        include: {
          employmentStatuses: {
            include: {
              employmentStatus: true,
            },
          },
        },
      })
      .then((result) => ({
        ...result,
        employmentStatuses:
          result?.employmentStatuses.map((es) => es.employmentStatus) || [],
      }));
  }

  // FIND ALL LEAVE TYPES - RETRIEVES LEAVE TYPES WITH PAGINATION, SEARCH, AND BUSINESS FILTERING
  async findAll({
    user,
    query,
  }: {
    user: JwtPayload;
    query: QueryLeaveTypeInput;
  }) {
    // BUSINESS ID EXTRACTION
    const businessId = user.businessId;
    const { pagination, ...filters } = query ?? {};

    // PAGINATION SETUP
    const { page, skip, limit, sortBy, sortOrder } =
      paginationHelpers.calculatePagination(pagination || {});

    // FILTER EXTRACTION
    const { searchTerm, status, leaveType } = filters;

    // QUERY BUILDER FOR SEARCH CONDITIONS
    const andCondition: any[] = [];
    // SEARCH IN NAME FIELD
    if (searchTerm) {
      andCondition.push({
        OR: leaveTypeSearchableFields.map((field) => ({
          [field]: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        })),
      });
    }
    // FILTER BY STATUS
    if (status) {
      andCondition.push({ status });
    }
    // FILTER BY LEAVE TYPE
    if (leaveType) {
      andCondition.push({ leaveType });
    }

    const whereCondition: Prisma.LeaveTypeWhereInput = andCondition.length
      ? { AND: andCondition }
      : {};

    // EXECUTE QUERY WITH OR WITHOUT PAGINATION
    const result = !limit
      ? await this.prisma.leaveType
          .findMany({
            where: {
              businessId,
            },
            include: {
              employmentStatuses: {
                include: {
                  employmentStatus: true,
                },
              },
            },
          })
          .then((leaveTypes) =>
            leaveTypes.map((lt) => ({
              ...lt,
              employmentStatuses: lt.employmentStatuses.map(
                (es) => es.employmentStatus,
              ),
            })),
          )
      : await this.prisma.leaveType
          .findMany({
            where: {
              ...whereCondition,
              businessId,
            },
            skip,
            take: limit,
            orderBy: {
              [sortBy]: sortOrder,
            },
            include: {
              employmentStatuses: {
                include: {
                  employmentStatus: true,
                },
              },
            },
          })
          .then((leaveTypes) =>
            leaveTypes.map((lt) => ({
              ...lt,
              employmentStatuses: lt.employmentStatuses.map(
                (es) => es.employmentStatus,
              ),
            })),
          );
    // LOG RESULT FOR DEBUGGING
    // this.logger.log(result);

    // CALCULATE PAGINATION METADATA
    const total = await this.prisma.leaveType.count({
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

  // FIND LEAVE TYPE BY ID - RETRIEVES A SINGLE LEAVE TYPE WITH BUSINESS VALIDATION
  async findOne({ user, id }: { user: JwtPayload; id: number }) {
    const businessId = user.businessId;
    const result = await this.prisma.leaveType.findUnique({
      where: { id, businessId },
      include: {
        employmentStatuses: {
          include: {
            employmentStatus: true,
          },
        },
      },
    });
    if (!result) {
      throw new NotFoundException(`Leave Type with ID ${id} not found`);
    }

    return {
      ...result,
      employmentStatuses: result.employmentStatuses.map(
        (es) => es.employmentStatus,
      ),
    };
  }

  // UPDATE LEAVE TYPE - MODIFIES AN EXISTING LEAVE TYPE RECORD
  async update({
    user,
    id,
    updateLeaveTypeInput,
  }: {
    user: JwtPayload;
    id: number;
    updateLeaveTypeInput: UpdateLeaveTypeInput;
  }) {
    await this.findOne({ user, id }); // VALIDATE LEAVE TYPE EXISTS

    const { employmentStatuses, ...leaveTypeData } = updateLeaveTypeInput;

    await this.prisma.leaveType.update({
      where: { id, businessId: user.businessId },
      data: leaveTypeData,
    });

    // UPDATE EMPLOYMENT STATUS RELATIONSHIPS IF PROVIDED
    if (employmentStatuses !== undefined) {
      // VALIDATE EMPLOYMENT STATUS IDS IF PROVIDED
      if (employmentStatuses.length > 0) {
        const existingEmploymentStatuses =
          await this.prisma.employmentStatus.findMany({
            where: {
              id: { in: employmentStatuses },
              businessId: user.businessId,
            },
            select: { id: true },
          });

        const existingIds = existingEmploymentStatuses.map((es) => es.id);
        const invalidIds = employmentStatuses.filter(
          (id) => !existingIds.includes(id),
        );

        if (invalidIds.length > 0) {
          throw new NotFoundException(
            `Employment Status(es) with ID(s) ${invalidIds.join(', ')} not found or do not belong to your business`,
          );
        }
      }

      // DELETE EXISTING RELATIONSHIPS
      await this.prisma.leaveTypeEmploymentStatus.deleteMany({
        where: { leaveTypeId: id },
      });

      // CREATE NEW RELATIONSHIPS IF ARRAY IS NOT EMPTY
      if (employmentStatuses.length > 0) {
        const employmentStatusData = employmentStatuses.map(
          (employmentStatusId) => ({
            leaveTypeId: id,
            employmentStatusId,
          }),
        );

        await this.prisma.leaveTypeEmploymentStatus.createMany({
          data: employmentStatusData,
        });
      }
    }

    // RETURN UPDATED LEAVE TYPE WITH EMPLOYMENT STATUSES
    return await this.prisma.leaveType
      .findUnique({
        where: { id },
        include: {
          employmentStatuses: {
            include: {
              employmentStatus: true,
            },
          },
        },
      })
      .then((result) => ({
        ...result,
        employmentStatuses:
          result?.employmentStatuses.map((es) => es.employmentStatus) || [],
      }));
  }

  // DELETE LEAVE TYPE - REMOVES A LEAVE TYPE RECORD FROM DATABASE
  async remove({ user, id }: { user: JwtPayload; id: number }) {
    await this.findOne({ user, id }); // VALIDATE LEAVE TYPE EXISTS
    return await this.prisma.leaveType.delete({
      where: { id, businessId: user.businessId },
    });
  }
}
