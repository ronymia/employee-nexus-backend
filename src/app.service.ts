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
  permissions,
  superAdminPermissions,
} from './config';
import { features } from './Database/features';

@Injectable()
export class AppService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  // UPDATE MODULE
  async moduleRefresh() {
    const res = await this.prisma.feature.createMany({
      data: features.map((module) => ({ name: module })),
      skipDuplicates: true,
    });

    return res;
  }

  // SEED SUPER ADMIN AND ROLE
  async seedSuperAdmin() {
    await this.prisma.$transaction(
      async (prismaTransaction: Prisma.TransactionClient) => {
        // 1. Ensure SUPER_ADMIN role exists
        await this.prisma.role.createMany({
          data: [
            {
              name: ROLE.SUPER_ADMIN,
              businessId: null,
            },
            {
              name: ROLE.OWNER,
              businessId: null,
            },
            {
              name: ROLE.MANAGER,
              businessId: null,
            },
            {
              name: ROLE.ADMIN,
              businessId: null,
            },
            {
              name: ROLE.EMPLOYEE,
              businessId: null,
            },
          ],
          skipDuplicates: true,
        });

        // 1. Ensure SUPER_ADMIN role exists
        const role = await this.prisma.role.findFirst({
          where: {
            name: ROLE.SUPER_ADMIN,
            businessId: null,
          },
        });

        if (!role) {
          throw new NotImplementedException('No Super Admin Role Found');
        }
        // 2. Check if a super admin user already exists
        const isSuperAdminExist = await this.prisma.user.findFirst({
          where: { roleId: role?.id },
        });

        // 3. Create Super Admin
        if (!isSuperAdminExist) {
          const password = await PasswordHelpers.passwordHash(
            configuration().default_password.super_admin as string,
          );
          const res = await prismaTransaction.user.create({
            data: { ...superUser, roleId: role?.id, password },
          });

          await prismaTransaction.profile.create({
            data: {
              ...superAdminProfile,
              userId: res.id,
            },
          });
        }

        // Seed notification templates
        // await seedNotificationTemplates();
      },
    );
  }

  // ROLE REFRESH
  // async roleRefresh() {
  //   type PermissionInput = { resource: string; action: string };
  //   type RolePermissionMap = Record<string, PermissionInput[]>;

  //   // 1. Define role-permission mapping
  //   const rolePermissionMap: RolePermissionMap = {
  //     super_admin: superAdminPermissions.flatMap((p) =>
  //       p.action.map((a) => ({ resource: p.resource, action: a })),
  //     ),
  //     owner: ownerPermissions.flatMap((p) =>
  //       p.action.map((a) => ({ resource: p.resource, action: a })),
  //     ),
  //     admin: adminPermissions.flatMap((p) =>
  //       p.action.map((a) => ({ resource: p.resource, action: a })),
  //     ),
  //     manager: managerPermissions.flatMap((p) =>
  //       p.action.map((a) => ({ resource: p.resource, action: a })),
  //     ),
  //     employee: employeePermissions.flatMap((p) =>
  //       p.action.map((a) => ({ resource: p.resource, action: a })),
  //     ),
  //   };

  //   // 2. Flatten & deduplicate permissions
  //   const allPermissions = Object.values(rolePermissionMap).flat();
  //   const uniquePermissions = Array.from(
  //     new Map(
  //       allPermissions.map((p) => [`${p.resource}_${p.action}`, p]),
  //     ).values(),
  //   );

  //   const roleRefresh = await this.prisma.$transaction(
  //     async (tx) => {
  //       // 3. Upsert all permissions
  //       await Promise.all(
  //         uniquePermissions.map((p) =>
  //           tx.permission.upsert({
  //             where: {
  //               resource_action: {
  //                 resource: p.resource,
  //                 action: p.action,
  //               },
  //             },
  //             create: p,
  //             update: {},
  //           }),
  //         ),
  //       );

  //       // 4. Fetch all roles (including super_admin)
  //       const roles = await tx.role.findMany();

  //       const allDbPermissions = await tx.permission.findMany();

  //       for (const role of roles) {
  //         const expectedPerms = rolePermissionMap[role.name];
  //         if (!expectedPerms) continue;

  //         const existingRolePerms = await tx.rolePermission.findMany({
  //           where: { roleId: role.id },
  //           include: { permission: true },
  //         });

  //         const expectedPermKeys = new Set(
  //           expectedPerms.map((p) => `${p.resource}_${p.action}`),
  //         );

  //         const existingPermKeys = new Set(
  //           existingRolePerms.map(
  //             (rp) => `${rp.permission.resource}_${rp.permission.action}`,
  //           ),
  //         );

  //         // Add missing RolePermissions
  //         for (const perm of expectedPerms) {
  //           const dbPerm = allDbPermissions.find(
  //             (p) => p.resource === perm.resource && p.action === perm.action,
  //           );
  //           if (!dbPerm) continue;

  //           const key = `${perm.resource}_${perm.action}`;
  //           if (!existingPermKeys.has(key)) {
  //             await tx.rolePermission.create({
  //               data: {
  //                 roleId: role.id,
  //                 permissionId: dbPerm.id,
  //               },
  //             });
  //           }
  //         }

  //         // Remove outdated RolePermissions
  //         for (const rp of existingRolePerms) {
  //           const key = `${rp.permission.resource}_${rp.permission.action}`;
  //           if (!expectedPermKeys.has(key)) {
  //             await tx.rolePermission.delete({
  //               where: {
  //                 roleId_permissionId: {
  //                   roleId: role.id,
  //                   permissionId: rp.permissionId,
  //                 },
  //               },
  //             });
  //           }
  //         }
  //       }

  //       return {
  //         message: 'Role permissions refreshed successfully',
  //         updatedRoles: roles.map((r) => r.name),
  //       };
  //     },
  //     {
  //       maxWait: 5000,
  //       timeout: 60000,
  //     },
  //   );

  //   return roleRefresh;
  // }

  async rolePermissionsRefresh() {
    // GET ALL ROLES FROM DATABASE
    const allRoles = await this.prisma.role.findMany();

    if (!allRoles || allRoles.length === 0) {
      throw new NotImplementedException('No Roles Found');
    }

    // GET ALL PERMISSIONS CONFIG
    const formattedPermissions = permissions.flatMap((permission) =>
      permission.action.map((action) => ({
        resource: permission.resource,
        action: action,
      })),
    );

    // GET ALL ROLE PERMISSION CONFIGS
    const rolePermissionConfigs = {
      [ROLE.SUPER_ADMIN]: superAdminPermissions.flatMap((permission) =>
        permission.action.map((action) => ({
          resource: permission.resource,
          action: action,
        })),
      ),
      [ROLE.OWNER]: ownerPermissions.flatMap((permission) =>
        permission.action.map((action) => ({
          resource: permission.resource,
          action: action,
        })),
      ),
      [ROLE.MANAGER]: managerPermissions.flatMap((permission) =>
        permission.action.map((action) => ({
          resource: permission.resource,
          action: action,
        })),
      ),
      [ROLE.ADMIN]: adminPermissions.flatMap((permission) =>
        permission.action.map((action) => ({
          resource: permission.resource,
          action: action,
        })),
      ),
      [ROLE.EMPLOYEE]: employeePermissions.flatMap((permission) =>
        permission.action.map((action) => ({
          resource: permission.resource,
          action: action,
        })),
      ),
    };

    // CREATE PERMISSION AND ROLE PERMISSION
    const roleRefresh = await this.prisma.$transaction(
      async (prismaClient: Prisma.TransactionClient) => {
        // CREATE ALL PERMISSIONS
        await prismaClient.permission.createMany({
          data: formattedPermissions,
          skipDuplicates: true,
        });

        // GET ALL PERMISSIONS FROM DB
        const databasePermissions = await prismaClient.permission.findMany();

        if (!databasePermissions) {
          throw new NotImplementedException('No Permissions Found');
        }

        // PROCESS EACH ROLE
        for (const role of allRoles) {
          // Determine role type (handle names like "OWNER#123" or "SUPER_ADMIN")
          const baseRoleName = role.name
            .split('#')[0]
            .toLowerCase()
            .replace('_', '_') as keyof typeof rolePermissionConfigs;

          // Skip if role type is not recognized
          if (!rolePermissionConfigs[baseRoleName]) {
            continue;
          }

          const rolePermissions = rolePermissionConfigs[baseRoleName];

          // Match permissions for this role
          const matchedPermissions = databasePermissions.filter((permission) =>
            rolePermissions.some(
              (rolePermission) =>
                String(permission.resource) ===
                  String(rolePermission.resource) &&
                String(permission.action) === String(rolePermission.action),
            ),
          );

          // Remove existing role permissions first
          await prismaClient.rolePermission.deleteMany({
            where: { roleId: role.id },
          });

          // Create new role-permission links
          if (matchedPermissions.length > 0) {
            await prismaClient.rolePermission.createMany({
              data: matchedPermissions.map((permission) => ({
                roleId: role.id,
                permissionId: permission.id,
              })),
              skipDuplicates: true,
            });
          }
        }

        // RETURN
        return `Role Permissions Refreshed for ${allRoles.length} roles`;
      },
      {
        maxWait: 1000 * 60,
        timeout: 1000 * 60 * 5,
      },
    );

    return roleRefresh;
  }

  // DEFAULT SETUP
  async setup() {
    // CREATE DEFAULT DATA

    const setup = await this.prisma.$transaction(
      async (prismaClient: Prisma.TransactionClient) => {
        // GET SUPER ADMIN
        const superAdmin = await prismaClient.role.findFirst({
          where: {
            name: ROLE.SUPER_ADMIN,
            businessId: null as any,
          },
        });
        if (!superAdmin) {
          throw new NotImplementedException('No Super Admin Role Found');
        }

        return `Setup Complete`;
      },
      {
        maxWait: 1000 * 60 * 5, // 5 minutes
        timeout: 1000 * 6 * 100, // 10 minutes
      },
    );

    return setup;
  }
}
