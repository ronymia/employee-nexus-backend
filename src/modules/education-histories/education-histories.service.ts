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

  async findAll({ userId }: { userId: number }) {
    return await this.prisma.educationHistory.findMany({
      where: {
        userId: userId,
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

  async findOne({ userId, id }: { userId: number; id: number }) {
    const educationHistory = await this.prisma.educationHistory.findUnique({
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
    await this.findOne({ userId, id });

    return await this.prisma.educationHistory.delete({
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
