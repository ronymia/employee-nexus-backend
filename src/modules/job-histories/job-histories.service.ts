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
        userId: user.userId,
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

  async findAll({ user }: { user: JwtPayload }) {
    return await this.prisma.jobHistory.findMany({
      where: {
        userId: user.userId,
      },
      include: {
        user: {
          include: {
            profile: true,
            role: true,
          },
        },
      },
      orderBy: {
        startDate: 'desc',
      },
    });
  }

  async findOne({ user, id }: { user: JwtPayload; id: number }) {
    const jobHistory = await this.prisma.jobHistory.findUnique({
      where: { id, userId: user.userId },
      include: {
        user: {
          include: {
            profile: true,
            role: true,
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
    user,
    id,
    updateJobHistoryInput,
  }: {
    user: JwtPayload;
    id: number;
    updateJobHistoryInput: UpdateJobHistoryInput;
  }) {
    await this.findOne({ user, id });

    return await this.prisma.jobHistory.update({
      where: { id, userId: user.userId },
      data: updateJobHistoryInput,
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

  async remove({ user, id }: { user: JwtPayload; id: number }) {
    await this.findOne({ user, id });

    return await this.prisma.jobHistory.delete({
      where: { id, userId: user.userId },
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
