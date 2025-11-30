import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSocialLinkInput } from './dto/create-social-link.input';
import { UpdateSocialLinkInput } from './dto/update-social-link.input';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from '../auth/jwt.strategy';
import { QuerySocialLinkInput } from './dto/query-social-link.input';
import { Prisma } from 'generated/prisma';
import { paginationHelpers } from 'src/helpers/paginationHelpers';
import { socialLinkSearchableFields } from './social-link.constant';

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

    // Verify that the profile belongs to the user
    const profile = await this.prisma.profile.findUnique({
      where: { id: parseInt(profileId), userId: user.userId },
    });

    if (!profile) {
      throw new NotFoundException(
        'Profile not found or does not belong to user',
      );
    }

    return await this.prisma.socialLink.upsert({
      where: { profileId: parseInt(profileId) },
      update: socialLinkData,
      create: {
        profileId: parseInt(profileId),
        ...socialLinkData,
      },
    });
  }

  async findAll({
    user,
    query,
  }: {
    user: JwtPayload;
    query: QuerySocialLinkInput;
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
        OR: socialLinkSearchableFields.map((field) => ({
          [field]: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        })),
      });
    }

    // Only show social links for profiles that belong to the user's business
    const userProfiles = await this.prisma.profile.findMany({
      where: {
        user: {
          businessId: user.businessId,
        },
      },
      select: { id: true },
    });

    const profileIds = userProfiles.map((p) => p.id);

    const whereCondition: Prisma.SocialLinkWhereInput = {
      AND: [
        ...andCondition,
        {
          profileId: {
            in: profileIds,
          },
        },
      ],
    };

    const result = !limit
      ? await this.prisma.socialLink.findMany({
          where: whereCondition,
          include: {
            profile: {
              include: {
                user: true,
              },
            },
          },
        })
      : await this.prisma.socialLink.findMany({
          where: whereCondition,
          skip,
          take: limit,
          orderBy: {
            [sortBy]: sortOrder,
          },
          include: {
            profile: {
              include: {
                user: true,
              },
            },
          },
        });

    // META
    const total = await this.prisma.socialLink.count({
      where: whereCondition,
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

  async findOne({ user, profileId }: { user: JwtPayload; profileId: number }) {
    // Verify that the profile belongs to the user's business
    const profile = await this.prisma.profile.findFirst({
      where: {
        id: profileId,
        user: {
          businessId: user.businessId,
        },
      },
    });

    if (!profile) {
      throw new NotFoundException(
        'Profile not found or does not belong to user',
      );
    }

    const result = await this.prisma.socialLink.findUnique({
      where: { profileId },
      include: {
        profile: {
          include: {
            user: true,
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
    user,
    profileId,
    updateSocialLinkInput,
  }: {
    user: JwtPayload;
    profileId: number;
    updateSocialLinkInput: UpdateSocialLinkInput;
  }) {
    // Verify that the profile belongs to the user
    const profile = await this.prisma.profile.findUnique({
      where: { id: profileId, userId: user.userId },
    });

    if (!profile) {
      throw new NotFoundException(
        'Profile not found or does not belong to user',
      );
    }

    const { profileId: _, ...updateData } = updateSocialLinkInput;

    return await this.prisma.socialLink.upsert({
      where: { profileId },
      update: updateData,
      create: {
        profileId,
        ...updateData,
      },
      include: {
        profile: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async remove({ user, profileId }: { user: JwtPayload; profileId: number }) {
    // Verify that the profile belongs to the user
    const profile = await this.prisma.profile.findUnique({
      where: { id: profileId, userId: user.userId },
    });

    if (!profile) {
      throw new NotFoundException(
        'Profile not found or does not belong to user',
      );
    }

    const socialLink = await this.prisma.socialLink.findUnique({
      where: { profileId },
    });

    if (!socialLink) {
      throw new NotFoundException(
        `Social links not found for profile ID ${profileId}`,
      );
    }

    return await this.prisma.socialLink.delete({
      where: { profileId },
      include: {
        profile: {
          include: {
            user: true,
          },
        },
      },
    });
  }
}
