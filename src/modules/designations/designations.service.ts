import { ConsoleLogger, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDesignationInput } from './dto/create-designation.input';
import { UpdateDesignationInput } from './dto/update-designation.input';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from '../auth/jwt.strategy';
import { QueryDesignationInput } from './dto/query-designation.input';
import { paginationHelpers } from 'src/helpers/paginationHelpers';
import { designationSearchableFields } from './designation.constant';
import { Prisma } from 'generated/prisma';

@Injectable()
export class DesignationsService {
  // PRISMA SERVICE
  constructor(private readonly prisma: PrismaService) {}
  // CONSOLE LOG
  private readonly logger = new ConsoleLogger(DesignationsService.name);

  // CREATE
  async create(
    user: JwtPayload,
    createDesignationInput: CreateDesignationInput,
  ) {
    return await this.prisma.designation.create({
      data: {
        ...createDesignationInput,
        business: {
          connect: {
            id: user.businessId,
          },
        },
      },
    });
  }

  async findAll({
    user,
    query,
  }: {
    user: JwtPayload;
    query: QueryDesignationInput;
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
        OR: designationSearchableFields.map((field) => ({
          [field]: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        })),
      });
    }
    const whereCondition: Prisma.DesignationWhereInput = andCondition.length
      ? { AND: andCondition }
      : {};

    const result = !limit
      ? await this.prisma.designation.findMany({
          where: {
            businessId,
          },
        })
      : await this.prisma.designation.findMany({
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
    const total = await this.prisma.designation.count({
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

  async findOne(user: JwtPayload, id: number) {
    const businessId = user.businessId;
    const result = await this.prisma.designation.findUnique({
      where: { id, businessId },
    });
    if (!result) {
      throw new NotFoundException(`Designation with ID ${id} not found`);
    }

    return result;
  }

  async update(
    user: JwtPayload,
    id: number,
    updateDesignationInput: UpdateDesignationInput,
  ) {
    await this.findOne(user, id); // Ensure the designation exists
    return await this.prisma.designation.update({
      where: { id, businessId: user.businessId },
      data: updateDesignationInput,
    });
  }

  async remove(user: JwtPayload, id: number) {
    await this.findOne(user, id); // Ensure the designation exists
    return await this.prisma.designation.delete({
      where: { id, businessId: user.businessId },
    });
  }
}
