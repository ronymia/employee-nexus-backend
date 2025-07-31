import { Injectable, NotImplementedException } from '@nestjs/common';
import { PrismaService } from './modules/prisma/prisma.service';
import { ROLE } from './enums';
import { PasswordHelpers } from './helpers/passwordHelpers';
import { Prisma } from 'generated/prisma';
import { ConfigService } from '@nestjs/config';
import { superAdminProfile, superUser } from './Database';
import configuration from './config/configuration';
import {
  adminPermissions,
  employeePermissions,
  managerPermissions,
  ownerPermissions,
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

  // ROLE REFRESH
  async roleRefresh() {
    type PermissionInput = { resource: string; action: string };
    type RolePermissionMap = Record<string, PermissionInput[]>;

    const rolePermissionMap: RolePermissionMap = {
      super_admin: superAdminPermissions.flatMap((p) =>
        p.action.map((a) => ({ resource: p.resource, action: a })),
      ),
      owner: ownerPermissions.flatMap((p) =>
        p.action.map((a) => ({ resource: p.resource, action: a })),
      ),
      admin: adminPermissions.flatMap((p) =>
        p.action.map((a) => ({ resource: p.resource, action: a })),
      ),
      manager: managerPermissions.flatMap((p) =>
        p.action.map((a) => ({ resource: p.resource, action: a })),
      ),
      employee: employeePermissions.flatMap((p) =>
        p.action.map((a) => ({ resource: p.resource, action: a })),
      ),
    };

    // Collect all unique permissions
    const allPermissions = Object.values(rolePermissionMap).flat();
    const uniquePermissions = Array.from(
      new Map(
        allPermissions.map((p) => [`${p.resource}_${p.action}`, p]),
      ).values(),
    );

    const roleRefresh = await this.prisma.$transaction(
      async (prismaTransaction) => {
        // 1. Upsert all unique permissions
        await Promise.all(
          uniquePermissions.map((p) =>
            prismaTransaction.permission.upsert({
              where: {
                resource_action: {
                  resource: p.resource,
                  action: p.action,
                },
              },
              create: p,
              update: {},
            }),
          ),
        );

        // 2. Get all roles and permissions from DB
        const roles = await prismaTransaction.role.findMany();
        const allDbPermissions = await prismaTransaction.permission.findMany();

        // 3. Sync permissions per role
        for (const role of roles) {
          const expectedPerms = rolePermissionMap[role.name];
          if (!expectedPerms) continue;

          // Get role's current RolePermission entries
          const existingRolePerms =
            await prismaTransaction.rolePermission.findMany({
              where: { roleId: role.id },
              include: { permission: true },
            });

          const expectedPermKeys = new Set(
            expectedPerms.map((p) => `${p.resource}_${p.action}`),
          );

          const existingPermKeys = new Set(
            existingRolePerms.map(
              (rp) => `${rp.permission.resource}_${rp.permission.action}`,
            ),
          );

          // 3a. Add missing permissions
          for (const perm of expectedPerms) {
            const dbPerm = allDbPermissions.find(
              (p) => p.resource === perm.resource && p.action === perm.action,
            );
            if (!dbPerm) continue;

            const key = `${perm.resource}_${perm.action}`;
            if (!existingPermKeys.has(key)) {
              await prismaTransaction.rolePermission.create({
                data: {
                  roleId: role.id,
                  permissionId: dbPerm.id,
                },
              });
            }
          }

          // 3b. Remove outdated permissions
          for (const rp of existingRolePerms) {
            const key = `${rp.permission.resource}_${rp.permission.action}`;
            if (!expectedPermKeys.has(key)) {
              await prismaTransaction.rolePermission.delete({
                where: {
                  roleId_permissionId: {
                    roleId: role.id,
                    permissionId: rp.permissionId,
                  },
                },
              });
            }
          }
        }

        return {
          message: 'Role permissions refreshed successfully',
          updatedRoles: Object.keys(rolePermissionMap),
        };
      },
      {
        maxWait: 5000,
        timeout: 60000,
      },
    );

    return roleRefresh;
  }

  // async roleRefresh() {
  //   // GET SUPER ADMIN ROLE ID
  //   const superAdminRole = await this.prisma.role.findUnique({
  //     where: {
  //       name_businessId: {
  //         name: ROLE.SUPER_ADMIN,
  //         businessId: null as any,
  //       },
  //     },
  //   });

  //   if (!superAdminRole) {
  //     throw new NotImplementedException('No Super Admin Role Found');
  //   }

  //   // GET OWNER ROLE ID
  //   const ownerRole = await this.prisma.role.findUnique({
  //     where: {
  //       name_businessId: {
  //         name: ROLE.OWNER,
  //         businessId: null as any,
  //       },
  //     },
  //   });

  //   if (!ownerRole) {
  //     throw new NotImplementedException('No Owner Role Found');
  //   }

  //   // GET MANAGER ROLE ID
  //   const managerRole = await this.prisma.role.findUnique({
  //     where: {
  //       name_businessId: {
  //         name: ROLE.MANAGER,
  //         businessId: null as any,
  //       },
  //     },
  //   });

  //   if (!managerRole) {
  //     throw new NotImplementedException('No Manager Role Found');
  //   }

  //   // GET ADMIN ROLE ID
  //   const adminRole = await this.prisma.role.findUnique({
  //     where: {
  //       name_businessId: {
  //         name: ROLE.ADMIN,
  //         businessId: null as any,
  //       },
  //     },
  //   });

  //   if (!adminRole) {
  //     throw new NotImplementedException('No Admin Role Found');
  //   }

  //   // GET EMPLOYEE ROLE ID
  //   const EmployeeRole = await this.prisma.role.findUnique({
  //     where: {
  //       name_businessId: {
  //         name: ROLE.EMPLOYEE,
  //         businessId: null as any,
  //       },
  //     },
  //   });

  //   if (!EmployeeRole) {
  //     throw new NotImplementedException('No Employee Role Found');
  //   }

  //   // GET ALL PERMISSIONS
  //   const formattedPermissions = permissions.flatMap((permission) =>
  //     permission.action.map((action) => ({
  //       resource: permission.resource,
  //       action: action,
  //     })),
  //   );

  //   // GET ALL SUPER ADMIN PERMISSIONS
  //   const formattedSuperAdminPermissions = superAdminPermissions.flatMap(
  //     (permission) =>
  //       permission.action.map((action) => ({
  //         resource: permission.resource,
  //         action: action,
  //       })),
  //   );

  //   // GET ALL OWNER PERMISSIONS
  //   const formattedOwnerPermissions = ownerPermissions.flatMap((permission) =>
  //     permission.action.map((action) => ({
  //       resource: permission.resource,
  //       action: action,
  //     })),
  //   );

  //   // GET ALL MANAGER PERMISSIONS
  //   const formattedManagerPermissions = managerPermissions.flatMap(
  //     (permission) =>
  //       permission.action.map((action) => ({
  //         resource: permission.resource,
  //         action: action,
  //       })),
  //   );

  //   // GET ALL ADMIN PERMISSIONS
  //   const formattedAdminPermissions = adminPermissions.flatMap((permission) =>
  //     permission.action.map((action) => ({
  //       resource: permission.resource,
  //       action: action,
  //     })),
  //   );

  //   // GET ALL EMPLOYEE PERMISSIONS
  //   const formattedEmployeePermissions = employeePermissions.flatMap(
  //     (permission) =>
  //       permission.action.map((action) => ({
  //         resource: permission.resource,
  //         action: action,
  //       })),
  //   );

  //   // GET SUPER ADMIN ROLE ID
  //   const superAdminRoleId = superAdminRole?.id;
  //   const ownerRoleId = ownerRole?.id;
  //   const managerRoleId = managerRole?.id;
  //   const adminRoleId = adminRole?.id;
  //   const employeeRoleId = EmployeeRole?.id;

  //   // CREATE PERMISSION AND ROLE PERMISSION
  //   const roleRefresh = await this.prisma.$transaction(
  //     async (prismaClient: Prisma.TransactionClient) => {
  //       // CREATE ALL PERMISSIONS
  //       await prismaClient.permission.createMany({
  //         data: formattedPermissions,
  //         skipDuplicates: true,
  //       });

  //       const allPermissions = await prismaClient.permission.findMany();

  //       // MATCH SUPER ADMIN PERMISSION

  //       // Match super admin permissions (with ID)
  //       const matchedSuperAdminPermissions = allPermissions.filter(
  //         (permission) =>
  //           formattedSuperAdminPermissions.some(
  //             (superAdminPermission) =>
  //               permission.resource === superAdminPermission.resource &&
  //               permission.action === superAdminPermission.action,
  //           ),
  //       );

  //       // Create role-permission links
  //       await prismaClient.rolePermission.createMany({
  //         data: matchedSuperAdminPermissions.map((permission) => ({
  //           roleId: superAdminRoleId,
  //           permissionId: permission?.id,
  //         })),
  //         skipDuplicates: true,
  //       });

  //       // CREATE OWNER PERMISSION
  //       // Match owner permissions (with ID)
  //       const matchedOwnerPermissions = allPermissions.filter((permission) =>
  //         formattedOwnerPermissions.some(
  //           (ownerPermission) =>
  //             permission.resource === ownerPermission.resource &&
  //             permission.action === ownerPermission.action,
  //         ),
  //       );

  //       // Create role-permission links
  //       await prismaClient.rolePermission.createMany({
  //         data: matchedOwnerPermissions.map((permission) => ({
  //           roleId: ownerRoleId,
  //           permissionId: permission?.id,
  //         })),
  //         skipDuplicates: true,
  //       });

  //       // CREATE MANAGER PERMISSION
  //       // Match owner permissions (with ID)
  //       const matchedManagerPermissions = allPermissions.filter((permission) =>
  //         formattedManagerPermissions.some(
  //           (ownerPermission) =>
  //             permission.resource === ownerPermission.resource &&
  //             permission.action === ownerPermission.action,
  //         ),
  //       );

  //       // Create role-permission links
  //       await prismaClient.rolePermission.createMany({
  //         data: matchedManagerPermissions.map((permission) => ({
  //           roleId: managerRoleId,
  //           permissionId: permission?.id,
  //         })),
  //         skipDuplicates: true,
  //       });

  //       // CREATE ADMIN PERMISSION
  //       // Match admin permissions (with ID)
  //       const matchedAdminPermissions = allPermissions.filter((permission) =>
  //         formattedAdminPermissions.some(
  //           (ownerPermission) =>
  //             permission.resource === ownerPermission.resource &&
  //             permission.action === ownerPermission.action,
  //         ),
  //       );

  //       // Create role-permission links
  //       await prismaClient.rolePermission.createMany({
  //         data: matchedAdminPermissions.map((permission) => ({
  //           roleId: adminRoleId,
  //           permissionId: permission?.id,
  //         })),
  //         skipDuplicates: true,
  //       });

  //       // CREATE EMPLOYEE PERMISSION
  //       // Match employee permissions (with ID)
  //       const matchedEmployeePermissions = allPermissions.filter((permission) =>
  //         formattedEmployeePermissions.some(
  //           (ownerPermission) =>
  //             permission.resource === ownerPermission.resource &&
  //             permission.action === ownerPermission.action,
  //         ),
  //       );

  //       // Create role-permission links
  //       await prismaClient.rolePermission.createMany({
  //         data: matchedEmployeePermissions.map((permission) => ({
  //           roleId: employeeRoleId,
  //           permissionId: permission?.id,
  //         })),
  //         skipDuplicates: true,
  //       });

  //       // RETURN
  //       return `Role Refresh`;
  //     },
  //     {
  //       maxWait: 1000 * 60,
  //       timeout: 1000 * 60 * 5,
  //     },
  //   );

  //   return roleRefresh;
  // }

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
