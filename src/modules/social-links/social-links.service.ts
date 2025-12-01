import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSocialLinkInput } from './dto/create-social-link.input';
import { UpdateSocialLinkInput } from './dto/update-social-link.input';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from '../auth/jwt.strategy';
import { Prisma } from 'generated/prisma';

@Injectable()
export class SocialLinksService {
  // PRISMA SERVICE
  constructor(private readonly prisma: PrismaService) {}

  async create({
    user,
    createSocialLinkInput,
  }: {
    user: JwtPayload;
    createSocialLinkInput: CreateSocialLinkInput;
  }) {
    const { profileId, ...socialLinkData } = createSocialLinkInput;
    const parsedProfileId = profileId;

    return await this.prisma.socialLink.upsert({
      where: { profileId: parsedProfileId },
      update: socialLinkData,
      create: {
        profileId: parsedProfileId,
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

  async findAll({ profileId }: { profileId?: number }) {
    // QUERY BUILDER
    const andCondition: any[] = [];

    // Filter by specific profileId if provided
    if (profileId) {
      andCondition.push({ profileId });
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

  async findOne({ profileId }: { profileId: number }) {
    const result = await this.prisma.socialLink.findUnique({
      where: { profileId },
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
        `Social links not found for profile ID ${profileId}`,
      );
    }

    return result;
  }

  async update({
    updateSocialLinkInput,
  }: {
    updateSocialLinkInput: UpdateSocialLinkInput;
  }) {
    const { profileId, ...updateData } = updateSocialLinkInput;
    const parsedProfileId = profileId as number;

    return await this.prisma.socialLink.upsert({
      where: { profileId: parsedProfileId },
      update: updateData,
      create: {
        profileId: parsedProfileId,
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

  async remove({ profileId }: { profileId: number }) {
    await this.findOne({ profileId }); // Ensure the social link exists

    return await this.prisma.socialLink.delete({
      where: { profileId },
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
