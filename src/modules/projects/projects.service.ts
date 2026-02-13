/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectInput } from './dto/create-project.input';
import { UpdateProjectInput } from './dto/update-project.input';
import { AssignProjectMemberInput } from './dto/assign-project-member.input';
import { UnassignProjectMemberInput } from './dto/unassign-project-member.input';
import { JwtPayload } from '../auth/jwt.strategy';
import * as dayjs from 'dayjs';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
import * as utc from 'dayjs/plugin/utc';
import { ROLE } from 'src/enums';

dayjs.extend(customParseFormat);
dayjs.extend(utc);

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
            employee: {
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
    const targetUser = await this.prisma.user.findUnique({
      where: { id: user.userId },
      include: {
        role: true,
      },
    });

    if (!targetUser) {
      throw new NotFoundException(`User with ID ${user.userId} not found`);
    }
    const userRoleName = targetUser.role.name as ROLE; // Explicitly cast to ROLE enum
    const filterBusinessId = businessId || user.businessId;

    // Build the `where` clause conditionally
    const whereClause: any = {
      businessId: filterBusinessId,
    };
    if (
      userRoleName === ROLE.EMPLOYEE ||
      userRoleName === ROLE.MANAGER ||
      userRoleName === ROLE.ADMIN
    ) {
      // For employees, managers, and admins, only return projects they are assigned to
      whereClause.projectMembers = {
        some: { employee: { userId: user.userId } },
      };
    }

    return this.prisma.project.findMany({
      where: whereClause,
      include: {
        business: true,
        creator: true,
        projectMembers: {
          include: {
            employee: {
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
        creator: {
          include: {
            profile: true,
            role: true,
          },
        },
        projectMembers: {
          where: {
            isActive: true,
          },
          include: {
            employee: {
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
            employee: {
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
            employee: {
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
    const {
      projectId,
      userId,
      role,
      startDate,
      endDate,
      isActive,
      remarks,
      notes,
    } = assignProjectMemberInput;

    // Check if project exists and belongs to user's business
    await this.findOne({ user, id: projectId });

    // Check if employee exists (basic validation - you might want to add more business logic)
    const targetEmployee = await this.prisma.employee.findUnique({
      where: { userId },
    });

    if (!targetEmployee) {
      throw new NotFoundException(`Employee with user ID ${userId} not found`);
    }

    // Check if user is already assigned to this project
    // const existingMember = await this.prisma.projectMember.findUnique({
    //   where: {
    //     projectId_userId: {
    //       projectId,
    //       userId,
    //     },
    //   },
    // });

    // if (existingMember) {
    //   // Update the existing member's role to track their progress
    //   // (e.g., Team Lead promoted to Project Manager)
    //   return this.prisma.projectMember.update({
    //     where: {
    //       projectId_userId: {
    //         projectId,
    //         userId,
    //       },
    //     },
    //     data: {
    //       role,
    //     },
    //     include: {
    //       project: true,
    //       user: {
    //         include: {
    //           profile: true,
    //         },
    //       },
    //     },
    //   });
    // }

    // Create the project member assignment
    return this.prisma.projectMember.create({
      data: {
        projectId,
        userId,
        role,
        startDate: dayjs(startDate).toISOString(),
        endDate: endDate ? dayjs(endDate).toISOString() : null,
        isActive: isActive ?? true,
        remarks,
        notes,
      },
      include: {
        project: true,
        employee: {
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

  async unassignMember({
    unassignProjectMemberInput,
  }: {
    unassignProjectMemberInput: UnassignProjectMemberInput;
  }) {
    const { projectId, userId, endDate, remarks } = unassignProjectMemberInput;

    // Check if the assignment exists
    const existingMember = await this.prisma.projectMember.findUnique({
      where: {
        projectId_userId_role: {
          projectId,
          userId,
          role: unassignProjectMemberInput.role,
        },
      },
    });

    if (!existingMember) {
      throw new NotFoundException(
        `User ${userId} is not assigned to project ${projectId}`,
      );
    }

    // Update the project member to mark as inactive and set end date
    return this.prisma.projectMember.update({
      where: {
        projectId_userId_role: {
          projectId,
          userId,
          role: existingMember.role as string,
        },
      },
      data: {
        isActive: false,
        endDate: endDate
          ? dayjs(endDate).toISOString()
          : dayjs.utc().toISOString(),
        remarks: remarks || existingMember.remarks,
      },
      include: {
        project: true,
        employee: {
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

  async getUserProjects({ userId }: { userId: number }) {
    const projectMembers = await this.prisma.projectMember.findMany({
      where: {
        userId,
        isActive: true,
      },
      include: {
        project: {
          include: {
            business: true,
            creator: {
              include: {
                profile: true,
                role: true,
              },
            },
            projectMembers: {
              include: {
                employee: {
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
            },
          },
        },
        employee: {
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
      orderBy: { createdAt: 'desc' },
    });

    // Extract projects from project members
    return projectMembers;
  }
}
