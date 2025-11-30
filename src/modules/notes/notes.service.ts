import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNoteInput } from './dto/create-note.input';
import { UpdateNoteInput } from './dto/update-note.input';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from '../auth/jwt.strategy';
import { QueryNoteInput } from './dto/query-note.input';
import { Prisma } from 'generated/prisma';
import { paginationHelpers } from 'src/helpers/paginationHelpers';
import { noteSearchableFields } from './note.constant';

@Injectable()
export class NotesService {
  // PRISMA SERVICE
  constructor(private readonly prisma: PrismaService) {}

  async create({
    user,
    createNoteInput,
  }: {
    user: JwtPayload;
    createNoteInput: CreateNoteInput;
  }) {
    const { userId, ...noteData } = createNoteInput;
    return await this.prisma.note.create({
      data: {
        ...noteData,
        userId,
        createdBy: user.userId,
        isPrivate: noteData.isPrivate ?? true,
      },
    });
  }

  async findAll({ user, query }: { user: JwtPayload; query: QueryNoteInput }) {
    // USER ID
    const userId = user.userId;
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
        OR: noteSearchableFields.map((field) => ({
          [field]: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        })),
      });
    }
    const whereCondition: Prisma.NoteWhereInput = andCondition.length
      ? { AND: andCondition }
      : {};

    const result = !limit
      ? await this.prisma.note.findMany({
          where: {
            userId,
          },
          include: {
            creator: {
              include: {
                profile: true,
              },
            },
          },
        })
      : await this.prisma.note.findMany({
          where: {
            ...whereCondition,
            userId,
          },
          skip,
          take: limit,
          orderBy: {
            [sortBy]: sortOrder,
          },
          include: {
            creator: {
              include: {
                profile: true,
              },
            },
          },
        });

    // META
    const total = await this.prisma.note.count({
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

  async findOne({ user, id }: { user: JwtPayload; id: number }) {
    const userId = user.userId;
    const result = await this.prisma.note.findUnique({
      where: { id, userId },
      include: {
        creator: {
          include: {
            profile: true,
          },
        },
      },
    });
    if (!result) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }

    return result;
  }

  async update({
    user,
    id,
    updateNoteInput,
  }: {
    user: JwtPayload;
    id: number;
    updateNoteInput: UpdateNoteInput;
  }) {
    await this.findOne({ user, id }); // Ensure the note exists
    const { ...updateData } = updateNoteInput; // Get update data (id is handled separately)
    return await this.prisma.note.update({
      where: { id, userId: user.userId },
      data: updateData,
      include: {
        creator: {
          include: {
            profile: true,
          },
        },
      },
    });
  }

  async remove({ user, id }: { user: JwtPayload; id: number }) {
    await this.findOne({ user, id }); // Ensure the note exists
    return await this.prisma.note.delete({
      where: { id, userId: user.userId },
      include: {
        creator: {
          include: {
            profile: true,
          },
        },
      },
    });
  }
}
