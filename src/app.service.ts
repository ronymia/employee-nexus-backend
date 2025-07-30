import { Injectable, NotImplementedException } from '@nestjs/common';
import { PrismaService } from './modules/prisma/prisma.service';
import { ROLE } from './enums';
import { PasswordHelpers } from './helpers/passwordHelpers';
import { Prisma } from 'generated/prisma';
import { ConfigService } from '@nestjs/config';
import { superAdminProfile, superUser } from './Database';
import configuration from './config/configuration';
import {
  businessOwnerPermissions,
  permissions,
  superAdminPermissions,
} from './config';
import { defaultDesignations } from './Database/designation';
import { defaultEmploymentStatuses } from './Database/employment-status';
import { defaultJobTypes } from './Database/job-type';
import { defaultJobPlatforms } from './Database/job-platform';
import { defaultLeaveTypes } from './Database/leave-type';
import { defaultRecruitmentProcesses } from './Database/recruitment-process';
import { defaultOnboardingProcesses } from './Database/onboarding-process';

@Injectable()
export class AppService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  // ROLE REFRESH
  async roleRefresh() {
    // GET ALL ROLES
    const roles = await this.prisma.role.findMany();
    if (roles.length === 0) {
      throw new NotImplementedException('No Roles Found');
    }

    // GET SUPER ADMIN ROLE ID
    const superAdminRoleId = roles.find(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
      (role) => role.name === ROLE.SUPER_ADMIN,
    )?.id;

    if (!superAdminRoleId) {
      throw new NotImplementedException('No Super Admin Role Found');
    }

    // GET BUSINESS OWNER ROLE ID
    const businessOwnerRoleId = roles.find(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
      (role) => role.name === ROLE.OWNER,
    )?.id;

    if (!businessOwnerRoleId) {
      throw new NotImplementedException('No Business Owner Role Found');
    }

    // GET ALL PERMISSIONS
    const formattedPermissions = permissions.flatMap((permission) =>
      permission.action.map((action) => ({
        resource: permission.resource,
        action: action,
      })),
    );

    // GET ALL SUPER ADMIN PERMISSIONS
    const formattedSuperAdminPermissions = superAdminPermissions.flatMap(
      (permission) =>
        permission.action.map((action) => ({
          resource: permission.resource,
          action: action,
        })),
    );

    // GET ALL BUSINESS OWNER PERMISSIONS
    const formattedOwnerPermissions = businessOwnerPermissions.flatMap(
      (permission) =>
        permission.action.map((action) => ({
          resource: permission.resource,
          action: action,
        })),
    );

    // CREATE PERMISSION AND ROLE PERMISSION
    const roleRefresh = await this.prisma.$transaction(
      async (prismaClient: Prisma.TransactionClient) => {
        // CREATE ALL PERMISSIONS
        await prismaClient.permission.createMany({
          data: formattedPermissions,
          skipDuplicates: true,
        });

        const allPermissions = await prismaClient.permission.findMany();

        // MATCH SUPER ADMIN PERMISSION

        // Match super admin permissions (with ID)
        const matchedSuperAdminPermissions = allPermissions.filter(
          (permission) =>
            formattedSuperAdminPermissions.some(
              (superAdminPermission) =>
                permission.resource === superAdminPermission.resource &&
                permission.action === superAdminPermission.action,
            ),
        );

        // Create role-permission links
        await prismaClient.rolePermission.createMany({
          data: matchedSuperAdminPermissions.map((permission) => ({
            roleId: superAdminRoleId,
            permissionId: permission?.id,
          })),
          skipDuplicates: true,
        });

        // CREATE OWNER PERMISSION
        // Match owner permissions (with ID)
        const matchedOwnerPermissions = allPermissions.filter((permission) =>
          formattedOwnerPermissions.some(
            (ownerPermission) =>
              permission.resource === ownerPermission.resource &&
              permission.action === ownerPermission.action,
          ),
        );

        // Create role-permission links
        await prismaClient.rolePermission.createMany({
          data: matchedOwnerPermissions.map((permission) => ({
            roleId: businessOwnerRoleId,
            permissionId: permission?.id,
          })),
          skipDuplicates: true,
        });

        // RETURN
        return `Role Refresh`;
      },
    );

    return roleRefresh;
  }

  // SEED SUPER ADMIN AND ROLE
  async seedSuperAdmin() {
    // 1. Ensure SUPER_ADMIN role exists
    await this.prisma.role.createMany({
      data: [
        {
          name: ROLE.SUPER_ADMIN,
        },
        {
          name: ROLE.OWNER,
        },
        {
          name: ROLE.MANAGER,
        },
        {
          name: ROLE.ADMIN,
        },
        {
          name: ROLE.EMPLOYEE,
        },
      ],
      skipDuplicates: true,
    });

    // 1. Ensure SUPER_ADMIN role exists
    const role = await this.prisma.role.findUnique({
      where: {
        name_businessId: {
          name: ROLE.SUPER_ADMIN,
          businessId: null as any,
        },
      },
    });

    if (!role) {
      throw new NotImplementedException('No Super Admin Role Found');
    }
    // 2. Check if a super admin user already exists
    const isSuperAdminExist = await this.prisma.user.findFirst({
      where: { roleId: role?.id },
    });

    if (!isSuperAdminExist) {
      const password = await PasswordHelpers.passwordHash(
        configuration().default_password.super_admin as string,
      );

      await this.prisma.$transaction(
        async (prismaClient: Prisma.TransactionClient) => {
          const res = await prismaClient.user.create({
            data: { ...superUser, roleId: role?.id, password },
          });

          await prismaClient.profile.create({
            data: {
              ...superAdminProfile,
              userId: res.id,
            },
          });
        },
      );
    }
  }

  // DEFAULT SETUP
  async setup() {
    // CREATE DEFAULT DATA

    const setup = await this.prisma.$transaction(
      async (prismaClient: Prisma.TransactionClient) => {
        // GET SUPER ADMIN
        const superAdmin = await prismaClient.role.findUnique({
          where: {
            name_businessId: {
              name: ROLE.SUPER_ADMIN,
              businessId: null as any,
            },
          },
        });
        if (!superAdmin) {
          throw new NotImplementedException('No Super Admin Role Found');
        }

        const creatorId = superAdmin?.id;
        // CREATE DEFAULT DESIGNATIONS
        await Promise.all(
          defaultDesignations.map((element) =>
            prismaClient.designation.upsert({
              where: {
                name_businessId: {
                  name: element.name,
                  businessId: null as any,
                },
              },
              update: {},
              create: {
                ...element,
                creator: {
                  connect: {
                    id: creatorId,
                  },
                },
              },
            }),
          ),
        );

        // CREATE DEFAULT EMPLOYMENT STATUS
        await Promise.all(
          defaultEmploymentStatuses.map(async (element) =>
            prismaClient.employmentStatus.upsert({
              where: {
                name_businessId: {
                  name: element.name,
                  businessId: null as any,
                },
              },
              update: {},
              create: {
                ...element,
                creator: {
                  connect: {
                    id: creatorId,
                  },
                },
              },
            }),
          ),
        );

        // CREATE DEFAULT JOB TYPE
        await Promise.all(
          defaultJobTypes.map(async (element) =>
            prismaClient.jobType.upsert({
              where: {
                name_businessId: {
                  name: element.name,
                  businessId: null as any,
                },
              },
              update: {},
              create: {
                ...element,
                creator: {
                  connect: {
                    id: creatorId,
                  },
                },
              },
            }),
          ),
        );

        // CREATE DEFAULT JOB PLATFORM
        await Promise.all(
          defaultJobPlatforms.map(async (element) =>
            prismaClient.jobPlatform.upsert({
              where: {
                name_businessId: {
                  name: element.name,
                  businessId: null as any,
                },
              },
              update: {},
              create: {
                ...element,
                creator: {
                  connect: {
                    id: creatorId,
                  },
                },
              },
            }),
          ),
        );

        // CREATE DEFAULT LEAVE TYPE
        await Promise.all(
          defaultLeaveTypes.map(async (element) =>
            prismaClient.leaveType.upsert({
              where: {
                name_businessId: {
                  name: element.name,
                  businessId: null as any,
                },
              },
              update: {},
              create: {
                ...element,
                creator: {
                  connect: {
                    id: creatorId,
                  },
                },
              },
            }),
          ),
        );

        // CREATE DEFAULT RECRUITMENT PROCESS
        await Promise.all(
          defaultRecruitmentProcesses.map(async (element) =>
            prismaClient.recruitmentProcess.upsert({
              where: {
                name_businessId: {
                  name: element.name,
                  businessId: null as any,
                },
              },
              update: {},
              create: {
                ...element,
                creator: {
                  connect: {
                    id: creatorId,
                  },
                },
              },
            }),
          ),
        );

        // CREATE DEFAULT ONBOARDING PROCESS
        await Promise.all(
          defaultOnboardingProcesses.map(async (element) =>
            prismaClient.onboardingProcess.upsert({
              where: {
                name_businessId: {
                  name: element.name,
                  businessId: null as any,
                },
              },
              update: {},
              create: {
                ...element,
                creator: {
                  connect: {
                    id: creatorId,
                  },
                },
              },
            }),
          ),
        );

        return `Setup Complete`;
      },
      {
        maxWait: 60000,
        timeout: 60000,
      },
    );

    return setup;
  }
}
