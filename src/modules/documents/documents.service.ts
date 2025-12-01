import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDocumentInput } from './dto/create-document.input';
import { UpdateDocumentInput } from './dto/update-document.input';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from '../auth/jwt.strategy';
import { QueryDocumentInput } from './dto/query-document.input';
import { Prisma } from 'generated/prisma';
import { paginationHelpers } from 'src/helpers/paginationHelpers';
import { documentSearchableFields } from './document.constant';

@Injectable()
export class DocumentsService {
  // PRISMA SERVICE
  constructor(private readonly prisma: PrismaService) {}

  async create({
    user,
    createDocumentInput,
  }: {
    user: JwtPayload;
    createDocumentInput: CreateDocumentInput;
  }) {
    return await this.prisma.document.create({
      data: {
        ...createDocumentInput,
      },
      include: {
        user: {
          include: {
            profile: true,
            role: true,
          },
        },
      },
    });
  }

  async findAll({
    userId,
    query,
  }: {
    userId: number;
    query: QueryDocumentInput;
  }) {
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
        OR: documentSearchableFields.map((field) => ({
          [field]: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        })),
      });
    }
    const whereCondition: Prisma.DocumentWhereInput = andCondition.length
      ? { AND: andCondition }
      : {};

    const result = !limit
      ? await this.prisma.document.findMany({
          where: {
            userId,
          },
        })
      : await this.prisma.document.findMany({
          where: {
            ...whereCondition,
            userId,
          },
          skip,
          take: limit,
          orderBy: {
            [sortBy]: sortOrder,
          },
        });

    // META
    const total = await this.prisma.document.count({
      where: {
        userId,
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

  async findOne({ userId, id }: { userId: number; id: number }) {
    const result = await this.prisma.document.findUnique({
      where: { id, userId },
      include: {
        user: {
          include: {
            profile: true,
            role: true,
          },
        },
      },
    });
    if (!result) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    return result;
  }

  async update({
    id,
    updateDocumentInput,
  }: {
    id: number;
    updateDocumentInput: UpdateDocumentInput;
  }) {
    const userId = updateDocumentInput.userId as number;

    await this.findOne({ userId, id }); // Ensure the document exists
    return await this.prisma.document.update({
      where: { id, userId },
      data: updateDocumentInput,
      include: {
        user: {
          include: {
            profile: true,
            role: true,
          },
        },
      },
    });
  }

  async remove({ userId, id }: { userId: number; id: number }) {
    await this.findOne({ userId, id }); // Ensure the document exists
    return await this.prisma.document.delete({
      where: { id, userId },
      include: {
        user: {
          include: {
            profile: true,
            role: true,
          },
        },
      },
    });
  }
}
