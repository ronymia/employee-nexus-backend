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
      include: {
        employee: {
          include: {
            user: {
              include: {
                profile: true,
              },
            },
          },
        },
        creator: {
          include: {
            profile: true,
          },
        },
      },
    });
  }

  async findAll({ userId, query }: { userId: number; query: QueryNoteInput }) {
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
            employee: {
              include: {
                user: {
                  include: {
                    profile: true,
                  },
                },
              },
            },
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
            employee: {
              include: {
                user: {
                  include: {
                    profile: true,
                  },
                },
              },
            },
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

  async findOne({ userId, id }: { userId: number; id: number }) {
    const result = await this.prisma.note.findUnique({
      where: { id, userId },
      include: {
        employee: {
          include: {
            user: {
              include: {
                profile: true,
              },
            },
          },
        },
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
    id,
    updateNoteInput,
  }: {
    id: number;
    updateNoteInput: UpdateNoteInput;
  }) {
    const userId = updateNoteInput.userId as number;

    await this.findOne({ userId, id }); // Ensure the note exists
    const { ...updateData } = updateNoteInput; // Get update data (id is handled separately)
    return await this.prisma.note.update({
      where: { id, userId },
      data: updateData,
      include: {
        employee: {
          include: {
            user: {
              include: {
                profile: true,
              },
            },
          },
        },
        creator: {
          include: {
            profile: true,
          },
        },
      },
    });
  }

  async remove({ userId, id }: { userId: number; id: number }) {
    await this.findOne({ userId, id }); // Ensure the note exists
    return await this.prisma.note.delete({
      where: { id, userId },
      include: {
        employee: {
          include: {
            user: {
              include: {
                profile: true,
              },
            },
          },
        },
        creator: {
          include: {
            profile: true,
          },
        },
      },
    });
  }
}
