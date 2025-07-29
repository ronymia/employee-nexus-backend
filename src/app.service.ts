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
import { defaultAttendanceSettings } from './Database/attendance-settings';
import { leaveSettings } from './Database/leave-settings';
import { paymentSettings } from './Database/payment-settings';
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

  // SETUP

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
      where: { name: ROLE.SUPER_ADMIN },
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
  async setup(businessId?: number) {
    // CREATE DEFAULT DATA
    const setup = await this.prisma.$transaction(
      async (prismaClient: Prisma.TransactionClient) => {
        // CREATE DEFAULT DESIGNATIONS
        await prismaClient.designation.createMany({
          data: defaultDesignations.map((designation) => ({
            ...designation,
            businessId,
          })),
          skipDuplicates: true,
        });

        // CREATE DEFAULT EMPLOYMENT STATUS
        await prismaClient.employmentStatus.createMany({
          data: defaultEmploymentStatuses.map((status) => ({
            ...status,
            businessId,
          })),
          skipDuplicates: true,
        });

        // CREATE DEFAULT JOB TYPE
        await prismaClient.jobType.createMany({
          data: defaultJobTypes.map((jobType) => ({ ...jobType, businessId })),
          skipDuplicates: true,
        });

        // CREATE DEFAULT JOB PLATFORM
        await prismaClient.jobPlatform.createMany({
          data: defaultJobPlatforms.map((platform) => ({
            ...platform,
            businessId,
          })),
          skipDuplicates: true,
        });

        // CREATE DEFAULT LEAVE TYPE
        await prismaClient.leaveType.createMany({
          data: defaultLeaveTypes.map((leaveType) => ({
            ...leaveType,
            businessId,
          })),
          skipDuplicates: true,
        });

        // CREATE DEFAULT RECRUITMENT PROCESS
        await prismaClient.recruitmentProcess.createMany({
          data: defaultRecruitmentProcesses.map((process) => ({
            ...process,
            businessId,
          })),
          skipDuplicates: true,
        });

        // CREATE DEFAULT ONBOARDING PROCESS
        await prismaClient.onboardingProcess.createMany({
          data: defaultOnboardingProcesses.map((process) => ({
            ...process,
            businessId,
          })),
          skipDuplicates: true,
        });

        // CREATE DEFAULT ATTENDANCE SETTINGS
        await prismaClient.attendanceSettings.create({
          data: {
            ...defaultAttendanceSettings,
            businessId,
          },
        });

        // CREATE DEFAULT LEAVE SETTINGS
        await prismaClient.leaveSettings.create({
          data: {
            ...leaveSettings,
            businessId,
          },
        });

        // CREATE DEFAULT PAYMENT SETTINGS
        await prismaClient.paymentSettings.create({
          data: {
            ...paymentSettings,
            businessId,
          },
        });

        // if (businessId) {
        //   // CREATE DEFAULT BUSINESS SETTINGS
        //   await prismaClient.businessSettings.create({
        //     data: {
        //       ...businessSettings,
        //       businessId,
        //     },
        //   });
        // }

        return `Setup Complete`;
      },
    );

    return setup;
  }
}
