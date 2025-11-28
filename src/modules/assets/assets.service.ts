import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAssetInput } from './dto/create-asset.input';
import { UpdateAssetInput } from './dto/update-asset.input';
import { AssignAssetInput } from './dto/assign-asset.input';
import { ReturnAssetInput } from './dto/return-asset.input';
import { JwtPayload } from '../auth/jwt.strategy';

@Injectable()
export class AssetsService {
  constructor(private prisma: PrismaService) {}

  async create({
    user,
    createAssetInput,
  }: {
    user: JwtPayload;
    createAssetInput: CreateAssetInput;
  }) {
    const { assignedTo, ...assetData } = createAssetInput;

    // Create the asset
    const asset = await this.prisma.asset.create({
      data: {
        ...assetData,
        createdBy: user.userId,
        businessId: user.businessId,
        status: assignedTo ? 'assigned' : 'unassigned',
      },
      include: {
        assetType: true,
        business: true,
        creator: true,
        assetAssignments: {
          include: {
            assignedToUser: true,
            assignedByUser: true,
          },
        },
      },
    });

    // If assignedTo is provided, create an assignment
    if (assignedTo) {
      await this.prisma.assetAssignment.create({
        data: {
          assetId: asset.id,
          assignedTo,
          assignedBy: user.userId,
        },
      });

      // Update asset status and userId
      await this.prisma.asset.update({
        where: { id: asset.id },
        data: {
          status: 'assigned',
        },
      });

      // Fetch updated asset with assignment
      return this.prisma.asset.findUnique({
        where: { id: asset.id },
        include: {
          assetType: true,
          business: true,
          creator: true,
          assetAssignments: {
            include: {
              assignedToUser: true,
              assignedByUser: true,
            },
          },
        },
      });
    }

    return asset;
  }

  async findAll({
    user,
    businessId,
  }: {
    user: JwtPayload;
    businessId?: number;
  }) {
    const filterBusinessId = businessId || user.businessId;

    return this.prisma.asset.findMany({
      where: { businessId: filterBusinessId },
      include: {
        assetType: true,
        business: true,
        creator: true,
        assetAssignments: {
          include: {
            assignedToUser: true,
            assignedByUser: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne({ user, id }: { user: JwtPayload; id: number }) {
    const asset = await this.prisma.asset.findUnique({
      where: { id, businessId: user.businessId },
      include: {
        assetType: true,
        business: true,
        creator: true,
        assetAssignments: {
          include: {
            assignedToUser: true,
            assignedByUser: true,
          },
          orderBy: { assignedAt: 'desc' },
        },
      },
    });

    if (!asset) {
      throw new NotFoundException(`Asset with ID ${id} not found`);
    }

    return asset;
  }

  async update({
    user,
    id,
    updateAssetInput,
  }: {
    user: JwtPayload;
    id: number;
    updateAssetInput: UpdateAssetInput;
  }) {
    const { id: assetId, ...updateData } = updateAssetInput;
    await this.findOne({ user, id: assetId }); // Ensure the asset exists and belongs to user's business

    const asset = await this.prisma.asset.update({
      where: { id: assetId, businessId: user.businessId },
      data: updateData,
      include: {
        assetType: true,
        business: true,
        creator: true,
        assetAssignments: {
          include: {
            assignedToUser: true,
            assignedByUser: true,
          },
        },
      },
    });

    return asset;
  }

  async remove({ user, id }: { user: JwtPayload; id: number }) {
    await this.findOne({ user, id }); // Ensure the asset exists and belongs to user's business

    const asset = await this.prisma.asset.delete({
      where: { id, businessId: user.businessId },
      include: {
        assetType: true,
        business: true,
        creator: true,
        assetAssignments: {
          include: {
            assignedToUser: true,
            assignedByUser: true,
          },
        },
      },
    });

    return asset;
  }

  async assign({
    assignAssetInput,
    user,
  }: {
    assignAssetInput: AssignAssetInput;
    user: JwtPayload;
  }) {
    const { assetId, assignedTo } = assignAssetInput;

    // Check if asset exists
    const asset = await this.prisma.asset.findUnique({
      where: { id: assetId },
    });

    if (!asset) {
      throw new NotFoundException(`Asset with ID ${assetId} not found`);
    }

    // Create assignment
    const assignment = await this.prisma.assetAssignment.create({
      data: {
        assetId,
        assignedTo,
        assignedBy: user.userId,
      },
      include: {
        asset: true,
        assignedToUser: true,
        assignedByUser: true,
      },
    });

    // Update asset status and userId
    await this.prisma.asset.update({
      where: { id: assetId },
      data: {
        status: 'assigned',
      },
    });

    return assignment;
  }

  async return(returnAssetInput: ReturnAssetInput) {
    const { assetId } = returnAssetInput;

    // Find the latest active assignment for this asset
    const latestAssignment = await this.prisma.assetAssignment.findFirst({
      where: {
        assetId,
        returnedAt: null,
      },
      orderBy: { assignedAt: 'desc' },
    });

    if (!latestAssignment) {
      throw new NotFoundException(
        `No active assignment found for asset ${assetId}`,
      );
    }

    // Update the assignment with return date
    const updatedAssignment = await this.prisma.assetAssignment.update({
      where: { id: latestAssignment.id },
      data: {
        returnedAt: new Date(),
        status: 'returned',
      },
      include: {
        asset: true,
        assignedToUser: true,
        assignedByUser: true,
      },
    });

    // Update asset status
    await this.prisma.asset.update({
      where: { id: assetId },
      data: {
        status: 'unassigned',
      },
    });

    return updatedAssignment;
  }
}
