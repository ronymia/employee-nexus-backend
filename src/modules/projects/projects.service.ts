import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectInput } from './dto/create-project.input';
import { UpdateProjectInput } from './dto/update-project.input';
import { AssignProjectMemberInput } from './dto/assign-project-member.input';
import { UnassignProjectMemberInput } from './dto/unassign-project-member.input';
import { JwtPayload } from '../auth/jwt.strategy';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create({
    user,
    createProjectInput,
  }: {
    user: JwtPayload;
    createProjectInput: CreateProjectInput;
  }) {
    return this.prisma.project.create({
      data: {
        ...createProjectInput,
        createdBy: user.userId,
        businessId: user.businessId,
      },
      include: {
        business: true,
        creator: true,
        projectMembers: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async findAll({
    user,
    businessId,
  }: {
    user: JwtPayload;
    businessId?: number;
  }) {
    const filterBusinessId = businessId || user.businessId;

    return this.prisma.project.findMany({
      where: { businessId: filterBusinessId },
      include: {
        business: true,
        creator: true,
        projectMembers: {
          include: {
            user: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne({ user, id }: { user: JwtPayload; id: number }) {
    const project = await this.prisma.project.findUnique({
      where: { id, businessId: user.businessId },
      include: {
        business: true,
        creator: true,
        projectMembers: {
          include: {
            user: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return project;
  }

  async update({
    user,
    id,
    updateProjectInput,
  }: {
    user: JwtPayload;
    id: number;
    updateProjectInput: UpdateProjectInput;
  }) {
    const { id: projectId, ...updateData } = updateProjectInput;
    await this.findOne({ user, id: projectId }); // Ensure the project exists and belongs to user's business

    return this.prisma.project.update({
      where: { id: projectId, businessId: user.businessId },
      data: updateData,
      include: {
        business: true,
        creator: true,
        projectMembers: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async remove({ user, id }: { user: JwtPayload; id: number }) {
    await this.findOne({ user, id }); // Ensure the project exists and belongs to user's business

    return this.prisma.project.delete({
      where: { id, businessId: user.businessId },
      include: {
        business: true,
        creator: true,
        projectMembers: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async assignMember({
    assignProjectMemberInput,
    user,
  }: {
    assignProjectMemberInput: AssignProjectMemberInput;
    user: JwtPayload;
  }) {
    const { projectId, userId, role } = assignProjectMemberInput;

    // Check if project exists and belongs to user's business
    await this.findOne({ user, id: projectId });

    // Check if user exists (basic validation - you might want to add more business logic)
    const targetUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!targetUser) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Check if user is already assigned to this project
    const existingMember = await this.prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
    });

    if (existingMember) {
      throw new NotFoundException(
        `User ${userId} is already assigned to project ${projectId}`,
      );
    }

    // Create the project member assignment
    return this.prisma.projectMember.create({
      data: {
        projectId,
        userId,
        role,
      },
      include: {
        project: true,
        user: true,
      },
    });
  }

  async unassignMember({
    unassignProjectMemberInput,
  }: {
    unassignProjectMemberInput: UnassignProjectMemberInput;
  }) {
    const { projectId, userId } = unassignProjectMemberInput;

    // Check if the assignment exists
    const existingMember = await this.prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
    });

    if (!existingMember) {
      throw new NotFoundException(
        `User ${userId} is not assigned to project ${projectId}`,
      );
    }

    // Remove the project member assignment
    return this.prisma.projectMember.delete({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
      include: {
        project: true,
        user: true,
      },
    });
  }
}
