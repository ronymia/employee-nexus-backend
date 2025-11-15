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
        createdBy: user.userId,
        businessId: user.businessId,
      },
      include: {
        parent: true,
        children: true,
        manager: true,
        creator: true,
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
    const { page, skip, limit, sortBy, sortOrder } =
      paginationHelpers.calculatePagination(pagination || {});

    // FILTER
    const { searchTerm, name, status } = filters;

    // QUERY BUILDER
    const andCondition: any[] = [];
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

    const whereCondition: Prisma.DepartmentWhereInput = andCondition.length
      ? { AND: andCondition }
      : {};

    const result = !limit
      ? await this.prisma.department.findMany({
          where: {
            businessId,
          },
          include: {
            parent: true,
            children: true,
            manager: true,
            creator: true,
            business: true,
          },
        })
      : await this.prisma.department.findMany({
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
            parent: true,
            children: true,
            manager: true,
            creator: true,
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
        creator: true,
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
        creator: true,
        business: true,
      },
    });
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
