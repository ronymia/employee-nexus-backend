import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEducationHistoryInput } from './dto/create-education-history.input';
import { UpdateEducationHistoryInput } from './dto/update-education-history.input';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from '../auth/jwt.strategy';

@Injectable()
export class EducationHistoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create({
    user,
    createEducationHistoryInput,
  }: {
    user: JwtPayload;
    createEducationHistoryInput: CreateEducationHistoryInput;
  }) {
    return await this.prisma.educationHistory.create({
      data: {
        ...createEducationHistoryInput,
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
    return await this.prisma.educationHistory.findMany({
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
    const educationHistory = await this.prisma.educationHistory.findUnique({
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

    if (!educationHistory) {
      throw new NotFoundException(`Education history with ID ${id} not found`);
    }

    return educationHistory;
  }

  async update({
    user,
    id,
    updateEducationHistoryInput,
  }: {
    user: JwtPayload;
    id: number;
    updateEducationHistoryInput: UpdateEducationHistoryInput;
  }) {
    await this.findOne({ user, id });

    return await this.prisma.educationHistory.update({
      where: { id, userId: user.userId },
      data: updateEducationHistoryInput,
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

    return await this.prisma.educationHistory.delete({
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
