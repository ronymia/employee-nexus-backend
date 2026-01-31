import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEducationHistoryInput } from './dto/create-education-history.input';
import { UpdateEducationHistoryInput } from './dto/update-education-history.input';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EducationHistoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create({
    createEducationHistoryInput,
  }: {
    createEducationHistoryInput: CreateEducationHistoryInput;
  }) {
    return await this.prisma.educationHistory.create({
      data: {
        ...createEducationHistoryInput,
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
      },
    });
  }

  async findAll({ userId }: { userId: number }) {
    return await this.prisma.educationHistory.findMany({
      where: {
        userId: userId,
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
      },
      orderBy: {
        startDate: 'desc',
      },
    });
  }

  async findOne({ userId, id }: { userId: number; id: number }) {
    const educationHistory = await this.prisma.educationHistory.findUnique({
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
      },
    });

    if (!educationHistory) {
      throw new NotFoundException(`Education history with ID ${id} not found`);
    }

    return educationHistory;
  }

  async update({
    id,
    updateEducationHistoryInput,
  }: {
    id: number;
    updateEducationHistoryInput: UpdateEducationHistoryInput;
  }) {
    const userId = updateEducationHistoryInput.userId as number;

    await this.findOne({ userId, id });

    return await this.prisma.educationHistory.update({
      where: { id, userId },
      data: updateEducationHistoryInput,
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
      },
    });
  }

  async remove({ userId, id }: { userId: number; id: number }) {
    await this.findOne({ userId, id });

    return await this.prisma.educationHistory.delete({
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
      },
    });
  }
}
