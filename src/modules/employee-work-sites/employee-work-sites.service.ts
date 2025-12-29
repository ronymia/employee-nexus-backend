import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AssignEmployeeWorkSiteInput } from './dto/assign-employee-work-site.input';
import { GetEmployeeWorkSitesInput } from './dto/get-employee-work-sites.input';
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
    getEmployeeWorkSitesInput,
  }: {
    user: JwtPayload;
    getEmployeeWorkSitesInput?: GetEmployeeWorkSitesInput;
  }) {
    const { userId, workSiteId, isActive } = getEmployeeWorkSitesInput || {};

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
}
