import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSocialLinkInput } from './dto/create-social-link.input';
import { UpdateSocialLinkInput } from './dto/update-social-link.input';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from 'generated/prisma';

@Injectable()
export class SocialLinksService {
  // PRISMA SERVICE
  constructor(private readonly prisma: PrismaService) {}

  async create({
    createSocialLinkInput,
  }: {
    createSocialLinkInput: CreateSocialLinkInput;
  }) {
    const { userId, ...socialLinkData } = createSocialLinkInput;
    const parsedUserId = userId;

    return await this.prisma.socialLink.upsert({
      where: { userId: parsedUserId },
      update: socialLinkData,
      create: {
        userId: parsedUserId,
        ...socialLinkData,
      },
      include: {
        profile: {
          include: {
            user: {
              include: {
                profile: true,
                role: true,
              },
            },
          },
        },
      },
    });
  }

  async findAll({ userId }: { userId?: number }) {
    // QUERY BUILDER
    const andCondition: any[] = [];

    // Filter by specific profileId if provided
    if (userId) {
      andCondition.push({ userId });
    }

    const whereCondition: Prisma.SocialLinkWhereInput = andCondition.length
      ? { AND: andCondition }
      : {};

    const result = await this.prisma.socialLink.findFirst({
      where: whereCondition,
      include: {
        profile: {
          include: {
            user: {
              include: {
                profile: true,
                role: true,
              },
            },
          },
        },
      },
    });

    return result;
  }

  async findOne({ userId }: { userId: number }) {
    const result = await this.prisma.socialLink.findUnique({
      where: { userId },
      include: {
        profile: {
          include: {
            user: {
              include: {
                profile: true,
                role: true,
              },
            },
          },
        },
      },
    });

    if (!result) {
      throw new NotFoundException(
        `Social links not found for user ID ${userId}`,
      );
    }

    return result;
  }

  async update({
    updateSocialLinkInput,
  }: {
    updateSocialLinkInput: UpdateSocialLinkInput;
  }) {
    const { userId, ...updateData } = updateSocialLinkInput;
    const parsedUserId = userId as number;

    return await this.prisma.socialLink.upsert({
      where: { userId: parsedUserId },
      update: updateData,
      create: {
        userId: parsedUserId,
        ...updateData,
      },
      include: {
        profile: {
          include: {
            user: {
              include: {
                profile: true,
                role: true,
              },
            },
          },
        },
      },
    });
  }

  async remove({ userId }: { userId: number }) {
    await this.findOne({ userId }); // Ensure the social link exists

    return await this.prisma.socialLink.delete({
      where: { userId },
      include: {
        profile: {
          include: {
            user: {
              include: {
                profile: true,
                role: true,
              },
            },
          },
        },
      },
    });
  }
}
