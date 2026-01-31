import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AssignEmployeeWorkSiteInput } from './dto/assign-employee-work-site.input';
import { QueryEmployeeWorkSitesInput } from './dto/query-employee-work-sites.input';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from '../auth/jwt.strategy';

@Injectable()
export class EmployeeWorkSitesService {
  constructor(private readonly prisma: PrismaService) {}

  // ASSIGN WORK SITE TO EMPLOYEE
  async assignEmployeeWorkSite({
    user,
    assignEmployeeWorkSiteInput,
  }: {
    user: JwtPayload;
    assignEmployeeWorkSiteInput: AssignEmployeeWorkSiteInput;
  }) {
    const {
      userId,
      workSiteId,
      isActive = true,
      ...dataFields
    } = assignEmployeeWorkSiteInput;

    // Validate employee exists and belongs to business
    const employee = await this.prisma.employee.findFirst({
      where: {
        userId,
        user: {
          businessId: user.businessId,
        },
      },
    });

    if (!employee) {
      throw new NotFoundException(
        `Employee with user ID ${userId} not found or does not belong to your business`,
      );
    }

    // Validate work site exists and belongs to business
    const workSite = await this.prisma.workSite.findFirst({
      where: {
        id: workSiteId,
        businessId: user.businessId,
      },
    });

    if (!workSite) {
      throw new HttpException(
        `Work site with ID ${workSiteId} not found or does not belong to your business`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    // If setting as active, deactivate other active work sites for this user
    if (isActive) {
      await this.prisma.employeeWorkSite.updateMany({
        where: {
          userId,
          isActive: true,
        },
        data: {
          isActive: false,
        },
      });
    }

    // Create or update employee work site
    return await this.prisma.employeeWorkSite.upsert({
      where: {
        userId_workSiteId: {
          userId,
          workSiteId,
        },
      },
      create: {
        userId,
        workSiteId,
        isActive,
        ...dataFields,
      },
      update: {
        isActive,
        ...dataFields,
      },
      include: {
        employee: {
          include: {
            user: {
              include: {
                profile: true,
              },
            },
          },
        },
        workSite: true,
      },
    });
  }

  // GET EMPLOYEE WORK SITES
  async getEmployeeWorkSites({
    user,
    queryEmployeeWorkSitesInput,
  }: {
    user: JwtPayload;
    queryEmployeeWorkSitesInput?: QueryEmployeeWorkSitesInput;
  }) {
    const { userId, workSiteId, isActive } = queryEmployeeWorkSitesInput || {};

    const whereCondition: {
      employee?: { user?: { businessId?: number } };
      userId?: number;
      workSiteId?: number;
      isActive?: boolean;
    } = {
      employee: {
        user: {
          businessId: user.businessId,
        },
      },
    };

    if (userId !== undefined) {
      whereCondition.userId = userId;
    }

    if (workSiteId !== undefined) {
      whereCondition.workSiteId = workSiteId;
    }

    if (isActive !== undefined) {
      whereCondition.isActive = isActive;
    }

    return await this.prisma.employeeWorkSite.findMany({
      where: whereCondition,
      include: {
        employee: {
          include: {
            user: {
              include: {
                profile: true,
              },
            },
          },
        },
        workSite: true,
      },
      orderBy: {
        startDate: 'desc',
      },
    });
  }

  // GET WORK SITE HISTORY FOR USER
  async getWorkSiteHistory({
    user,
    userId,
  }: {
    user: JwtPayload;
    userId: number;
  }) {
    const businessId = user.businessId;
    if (!businessId) throw new Error('Business ID not found in token');

    // Verify user belongs to business
    const targetUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!targetUser || targetUser.businessId !== businessId) {
      throw new NotFoundException(
        `User with ID ${userId} not found in your business`,
      );
    }

    return await this.prisma.employeeWorkSite.findMany({
      where: { userId },
      orderBy: {
        startDate: 'desc',
      },
      include: {
        employee: {
          include: {
            user: {
              include: {
                profile: true,
              },
            },
          },
        },
        workSite: true,
      },
    });
  }

  // GET ACTIVE WORK SITES FOR USER
  async getActiveWorkSites({
    user,
    userId,
  }: {
    user: JwtPayload;
    userId: number;
  }) {
    const businessId = user.businessId;
    if (!businessId) throw new Error('Business ID not found in token');

    const targetUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!targetUser || targetUser.businessId !== businessId) {
      throw new NotFoundException(
        `User with ID ${userId} not found in your business`,
      );
    }

    return await this.prisma.employeeWorkSite.findMany({
      where: {
        userId,
        isActive: true,
      },
      include: {
        employee: {
          include: {
            user: {
              include: {
                profile: true,
              },
            },
          },
        },
        workSite: true,
      },
    });
  }

  // GET BY COMPOSITE ID
  async getByCompositeId({
    user,
    userId,
    workSiteId,
  }: {
    user: JwtPayload;
    userId: number;
    workSiteId: number;
  }) {
    const businessId = user.businessId;
    if (!businessId) throw new Error('Business ID not found in token');

    const employeeWorkSite = await this.prisma.employeeWorkSite.findUnique({
      where: {
        userId_workSiteId: {
          userId,
          workSiteId,
        },
      },
      include: {
        employee: {
          include: {
            user: {
              include: {
                profile: true,
              },
            },
          },
        },
        workSite: true,
      },
    });

    if (!employeeWorkSite) {
      throw new NotFoundException(`Employee work site assignment not found`);
    }

    if (employeeWorkSite.employee.user.businessId !== businessId) {
      throw new NotFoundException(
        `Employee work site assignment not found in your business`,
      );
    }

    return employeeWorkSite;
  }

  // UPDATE EMPLOYEE WORK SITE
  async updateEmployeeWorkSite({
    user,
    userId,
    workSiteId,
    updateData,
  }: {
    user: JwtPayload;
    userId: number;
    workSiteId: number;
    updateData: Partial<AssignEmployeeWorkSiteInput>;
  }) {
    const businessId = user.businessId;
    if (!businessId) throw new Error('Business ID not found in token');

    await this.getByCompositeId({ user, userId, workSiteId });

    return await this.prisma.employeeWorkSite.update({
      where: {
        userId_workSiteId: {
          userId,
          workSiteId,
        },
      },
      data: updateData,
      include: {
        employee: {
          include: {
            user: {
              include: {
                profile: true,
              },
            },
          },
        },
        workSite: true,
      },
    });
  }
}
