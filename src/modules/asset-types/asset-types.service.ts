import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateAssetTypeInput } from './dto/create-asset-type.input';
import { UpdateAssetTypeInput } from './dto/update-asset-type.input';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from '../auth/jwt.strategy';
import { QueryAssetTypeInput } from './dto/query-asset-type.input';
import { Prisma } from 'generated/prisma';
import { paginationHelpers } from 'src/helpers/paginationHelpers';
import { assetTypeSearchableFields } from './assetType.constant';
import { Status } from 'src/common/enums';

@Injectable()
export class AssetTypesService {
  // PRISMA SERVICE
  constructor(private readonly prisma: PrismaService) {}

  async create({
    user,
    createAssetTypeInput,
  }: {
    user: JwtPayload;
    createAssetTypeInput: CreateAssetTypeInput;
  }) {
    // Check if asset type with same name already exists for this business
    const existingAssetType = await this.prisma.assetType.findUnique({
      where: {
        name_businessId: {
          name: createAssetTypeInput.name,
          businessId: user.businessId,
        },
      },
    });

    if (existingAssetType) {
      throw new ConflictException(
        `Asset type with name "${createAssetTypeInput.name}" already exists for this business`,
      );
    }

    return await this.prisma.assetType.create({
      data: {
        ...createAssetTypeInput,
        createdBy: user.userId,
        businessId: user.businessId,
        status: Status.ACTIVE,
      },
    });
  }

  async findAll({
    user,
    query,
  }: {
    user: JwtPayload;
    query: QueryAssetTypeInput;
  }) {
    // BUSINESS ID
    const businessId = user.businessId;
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
        OR: assetTypeSearchableFields.map((field) => ({
          [field]: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        })),
      });
    }
    const whereCondition: Prisma.AssetTypeWhereInput = andCondition.length
      ? { AND: andCondition }
      : {};

    const result = !limit
      ? await this.prisma.assetType.findMany({
          where: {
            businessId,
          },
        })
      : await this.prisma.assetType.findMany({
          where: {
            ...whereCondition,
            businessId,
          },
          skip,
          take: limit,
          orderBy: {
            [sortBy]: sortOrder,
          },
        });

    // META
    const total = await this.prisma.assetType.count({
      where: {
        businessId,
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
    const businessId = user.businessId;

    const assetType = await this.prisma.assetType.findFirst({
      where: {
        id,
        businessId,
      },
    });

    if (!assetType) {
      throw new NotFoundException(
        `Asset Type with ID ${id} not found for your business`,
      );
    }

    return assetType;
  }

  async update({
    user,
    updateAssetTypeInput,
  }: {
    user: JwtPayload;
    updateAssetTypeInput: UpdateAssetTypeInput;
  }) {
    const { id, ...updateData } = updateAssetTypeInput;
    const businessId = user.businessId;

    // Check if asset type exists and belongs to user's business
    const existingAssetType = await this.prisma.assetType.findFirst({
      where: {
        id,
        businessId,
      },
    });

    if (!existingAssetType) {
      throw new NotFoundException(
        `Asset Type with ID ${id} not found for your business`,
      );
    }

    // Check if updating name and if it conflicts with existing asset type
    if (
      updateAssetTypeInput.name &&
      updateAssetTypeInput.name !== existingAssetType.name
    ) {
      const nameConflict = await this.prisma.assetType.findUnique({
        where: {
          name_businessId: {
            name: updateAssetTypeInput.name,
            businessId,
          },
        },
      });

      if (nameConflict) {
        throw new ConflictException(
          `Asset type with name "${updateAssetTypeInput.name}" already exists for this business`,
        );
      }
    }

    return await this.prisma.assetType.update({
      where: { id, businessId },
      data: updateData,
    });
  }

  async remove({ user, id }: { user: JwtPayload; id: number }) {
    const businessId = user.businessId;

    // Check if asset type exists and belongs to user's business
    const existingAssetType = await this.prisma.assetType.findFirst({
      where: {
        id,
        businessId,
      },
    });

    if (!existingAssetType) {
      throw new NotFoundException(
        `Asset Type with ID ${id} not found for your business`,
      );
    }

    return await this.prisma.assetType.delete({
      where: { id, businessId },
    });
  }
}
