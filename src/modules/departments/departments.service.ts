// DEPARTMENTS SERVICE - PROVIDES BUSINESS LOGIC FOR DEPARTMENT CRUD OPERATIONS
import { ConsoleLogger, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDepartmentInput } from './dto/create-department.input';
import { UpdateDepartmentInput } from './dto/update-department.input';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from '../auth/jwt.strategy';
import { QueryDepartmentInput } from './dto/query-department.input';
import { Prisma } from 'generated/prisma';
import { paginationHelpers } from 'src/helpers/paginationHelpers';
import { departmentSearchableFields } from './department.constant';
import { Status } from 'src/common/enums';
import { ROLE } from 'src/enums';

@Injectable()
export class DepartmentsService {
  // PRISMA SERVICE INJECTION
  constructor(private readonly prisma: PrismaService) {}
  // CONSOLE LOGGER FOR DEBUGGING
  private readonly logger = new ConsoleLogger(DepartmentsService.name);

  // CREATE DEPARTMENT - CREATES A NEW DEPARTMENT RECORD WITH BUSINESS SCOPING
  async create({
    user,
    createDepartmentInput,
  }: {
    user: JwtPayload;
    createDepartmentInput: CreateDepartmentInput;
  }) {
    // VALIDATE PARENT DEPARTMENT IF PROVIDED
    if (createDepartmentInput.parentId) {
      const parentDepartment = await this.prisma.department.findUnique({
        where: {
          id: createDepartmentInput.parentId,
          businessId: user.businessId,
        },
      });

      if (!parentDepartment) {
        throw new NotFoundException(
          `Parent department with ID ${createDepartmentInput.parentId} not found or does not belong to your business`,
        );
      }
    }

    // VALIDATE MANAGER IF PROVIDED
    if (createDepartmentInput.managerId) {
      const manager = await this.prisma.user.findUnique({
        where: {
          id: createDepartmentInput.managerId,
        },
      });

      if (!manager) {
        throw new NotFoundException(
          `Manager with ID ${createDepartmentInput.managerId} not found`,
        );
      }
    }

    return await this.prisma.department.create({
      data: {
        ...createDepartmentInput,
        businessId: user.businessId,
        status: Status.ACTIVE,
      },
      include: {
        parent: true,
        children: true,
        manager: true,
        business: true,
      },
    });
  }

  // FIND ALL DEPARTMENTS - RETRIEVES DEPARTMENTS WITH PAGINATION, SEARCH, AND BUSINESS FILTERING
  async findAll({
    user,
    query,
  }: {
    user: JwtPayload;
    query: QueryDepartmentInput;
  }) {
    // BUSINESS ID
    const businessId = user.businessId;
    const { pagination, ...filters } = query ?? {};

    // PAGINATION
    const {
      page,
      skip,
      limit,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = paginationHelpers.calculatePagination(pagination || {});

    // FILTER
    const { searchTerm, name, status } = filters;

    if (!user.businessId) {
      throw new NotFoundException('Business not found');
    }
    if (!user.userId) {
      throw new NotFoundException('User not found');
    }
    // const managerId
    const targetUser = await this.prisma.user.findUniqueOrThrow({
      where: { id: user.userId },
      select: {
        businessId: true,
        role: {
          select: {
            name: true,
          },
        },
      },
    });
    // QUERY BUILDER
    const andCondition: Prisma.DepartmentWhereInput[] = [
      {
        businessId,
      },
    ];

    // Managers see their department and all children departments
    if (targetUser.role.name === (ROLE.MANAGER as any)) {
      // Show departments where manager is directly assigned OR parent is managed by this manager
      andCondition.push({
        OR: [
          {
            managerId: user.userId, // Direct management
          },
          {
            parent: {
              managerId: user.userId, // Children of managed departments
            },
          },
        ],
      });
    }

    // Search in Field
    if (searchTerm) {
      andCondition.push({
        OR: departmentSearchableFields.map((field) => ({
          [field]: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        })),
      });
    }
    // Filter by name
    if (name) {
      andCondition.push({ name });
    }
    // Filter by status
    if (status) {
      andCondition.push({ status });
    }

    //
    const whereCondition: Prisma.DepartmentWhereInput = andCondition.length
      ? { AND: andCondition }
      : {};

    //
    const result = !limit
      ? await this.prisma.department.findMany({
          where: whereCondition,
          orderBy: {
            [sortBy]: sortOrder,
          },
          include: {
            parent: true,
            children: true,
            manager: {
              include: {
                profile: true,
              },
            },
            business: true,
          },
        })
      : await this.prisma.department.findMany({
          where: whereCondition,
          skip,
          take: limit,
          orderBy: {
            [sortBy]: sortOrder,
          },
          include: {
            parent: true,
            children: true,
            manager: {
              include: {
                profile: true,
              },
            },
            business: true,
          },
        });
    // this.logger.log(result);

    // META
    const total = await this.prisma.department.count({
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

  // FIND DEPARTMENT BY ID - RETRIEVES A SINGLE DEPARTMENT WITH BUSINESS VALIDATION
  async findOne({ user, id }: { user: JwtPayload; id: number }) {
    const businessId = user.businessId;
    const result = await this.prisma.department.findUnique({
      where: { id, businessId },
      include: {
        parent: true,
        children: true,
        manager: true,
        business: true,
      },
    });
    if (!result) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }

    return result;
  }

  // UPDATE DEPARTMENT - MODIFIES AN EXISTING DEPARTMENT RECORD
  async update({
    user,
    id,
    updateDepartmentInput,
  }: {
    user: JwtPayload;
    id: number;
    updateDepartmentInput: UpdateDepartmentInput;
  }) {
    await this.findOne({ user, id }); // Ensure the department exists

    // VALIDATE PARENT DEPARTMENT IF PROVIDED
    if (updateDepartmentInput.parentId) {
      const parentDepartment = await this.prisma.department.findUnique({
        where: {
          id: updateDepartmentInput.parentId,
          businessId: user.businessId,
        },
      });

      if (!parentDepartment) {
        throw new NotFoundException(
          `Parent department with ID ${updateDepartmentInput.parentId} not found or does not belong to your business`,
        );
      }

      // Prevent circular reference
      if (updateDepartmentInput.parentId === id) {
        throw new NotFoundException('Department cannot be its own parent');
      }
    }

    // VALIDATE MANAGER IF PROVIDED
    if (updateDepartmentInput.managerId) {
      const manager = await this.prisma.user.findUnique({
        where: {
          id: updateDepartmentInput.managerId,
        },
      });

      if (!manager) {
        throw new NotFoundException(
          `Manager with ID ${updateDepartmentInput.managerId} not found`,
        );
      }
    }

    return await this.prisma.department.update({
      where: { id, businessId: user.businessId },
      data: updateDepartmentInput,
      include: {
        parent: true,
        children: true,
        manager: true,
        business: true,
      },
    });
  }

  // CHECK IF DEPARTMENT IS DEFAULT - VERIFIES IF DEPARTMENT IS SET AS DEFAULT IN SYSTEM DEFAULTS
  async isDefault({
    departmentId,
    businessId,
  }: {
    departmentId: number;
    businessId: number;
  }): Promise<boolean> {
    const systemDefaults = await this.prisma.systemDefaults.findUnique({
      where: { businessId },
      select: { defaultDepartmentId: true },
    });

    return systemDefaults?.defaultDepartmentId === departmentId;
  }

  // DELETE DEPARTMENT - REMOVES A DEPARTMENT RECORD FROM DATABASE
  async remove({ user, id }: { user: JwtPayload; id: number }) {
    await this.findOne({ user, id }); // Ensure the department exists

    // Check if department has children
    const childrenCount = await this.prisma.department.count({
      where: { parentId: id },
    });

    if (childrenCount > 0) {
      throw new NotFoundException(
        'Cannot delete department with child departments. Please reassign or delete child departments first.',
      );
    }

    return await this.prisma.department.delete({
      where: { id, businessId: user.businessId },
    });
  }
}
