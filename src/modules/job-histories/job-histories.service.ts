import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateJobHistoryInput } from './dto/create-job-history.input';
import { UpdateJobHistoryInput } from './dto/update-job-history.input';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from '../auth/jwt.strategy';

@Injectable()
export class JobHistoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create({
    user,
    createJobHistoryInput,
  }: {
    user: JwtPayload;
    createJobHistoryInput: CreateJobHistoryInput;
  }) {
    return await this.prisma.jobHistory.create({
      data: {
        ...createJobHistoryInput,
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
    return await this.prisma.jobHistory.findMany({
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
    const jobHistory = await this.prisma.jobHistory.findUnique({
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

    if (!jobHistory) {
      throw new NotFoundException(`Job history with ID ${id} not found`);
    }

    return jobHistory;
  }

  async update({
    id,
    updateJobHistoryInput,
  }: {
    id: number;
    updateJobHistoryInput: UpdateJobHistoryInput;
  }) {
    const userId = updateJobHistoryInput.userId as number;

    await this.findOne({ userId, id });

    return await this.prisma.jobHistory.update({
      where: { id, userId },
      data: updateJobHistoryInput,
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

    return await this.prisma.jobHistory.delete({
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
