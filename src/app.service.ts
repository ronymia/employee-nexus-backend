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
import { subscriptionPlans } from './Database/subscription.seeders';

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
        await prismaTransaction.role.createMany({
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

        // 2. Ensure SUPER_ADMIN role exists
        const role = await prismaTransaction.role.findFirst({
          where: {
            name: ROLE.SUPER_ADMIN,
            businessId: null,
          },
        });

        if (!role) {
          throw new NotImplementedException('No Super Admin Role Found');
        }
        // 3. Check if a super admin user already exists
        const isSuperAdminExist = await prismaTransaction.user.findFirst({
          where: { roleId: role?.id },
        });

        // 4. Create Super Admin
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

        // 5. Create/refresh features (modules)
        await prismaTransaction.feature.createMany({
          data: features.map((module) => ({ name: module })),
          skipDuplicates: true,
        });

        // 6. Create subscription plans
        await Promise.all(
          subscriptionPlans.map(
            async (plan) =>
              await prismaTransaction.subscriptionPlan.create({
                data: {
                  ...plan,
                },
              }),
          ),
        );

        // 7. Relation plan with feature
        const subscriptionPlan =
          await prismaTransaction.subscriptionPlan.findMany({
            select: {
              id: true,
            },
          });
        await prismaTransaction.subscriptionPlanFeature.createMany({
          data: subscriptionPlan.map((plan) => ({
            subscriptionPlanId: plan.id,
            featureId: 1,
          })),
          skipDuplicates: true,
        });
      },
    );
  }

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

    await this.seedSuperAdmin();

    // CREATE DEFAULT ROLE PERMISSIONS
    await this.rolePermissionsRefresh();
    return {
      message: 'Setup Completed',
    };
  }
}
