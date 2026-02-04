/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Prisma } from 'generated/prisma';
import { ROLE } from 'src/enums';
import {
  adminPermissions,
  employeePermissions,
  managerPermissions,
  ownerPermissions,
  permissions,
} from 'src/config';

export const seedPermissionsAndRolePermissions = async (
  tx: Prisma.TransactionClient,
  roles: {
    ownerRole: { id: number; name: string };
    adminRole: { id: number; name: string };
    managerRole: { id: number; name: string };
    employeeRole: { id: number; name: string };
  },
) => {
  console.log('🔐 Creating permissions and role permissions...');

  // Format all permissions from config
  const formattedPermissions = permissions.flatMap((permission) =>
    permission.action.map((action) => ({
      resource: permission.resource,
      action: action,
    })),
  );

  // Create all permissions (skip duplicates)
  await tx.permission.createMany({
    data: formattedPermissions,
    skipDuplicates: true,
  });

  // Get all permissions from database
  const databasePermissions = await tx.permission.findMany();

  if (!databasePermissions || databasePermissions.length === 0) {
    throw new Error('No permissions found in database');
  }

  // Define role permission configs
  const rolePermissionConfigs = {
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

  // Assign permissions to each role
  const rolesToProcess = [
    { role: roles.ownerRole, configKey: ROLE.OWNER },
    { role: roles.adminRole, configKey: ROLE.ADMIN },
    { role: roles.managerRole, configKey: ROLE.MANAGER },
    { role: roles.employeeRole, configKey: ROLE.EMPLOYEE },
  ];

  for (const { role, configKey } of rolesToProcess) {
    const rolePermissions = rolePermissionConfigs[configKey];

    if (!rolePermissions) {
      console.warn(`⚠️  No permissions configured for role: ${configKey}`);
      continue;
    }

    // Delete existing role permissions (cleanup)
    await tx.rolePermission.deleteMany({
      where: { roleId: role.id },
    });

    // Map permissions to rolePermission records
    const rolePermissionRecords: { roleId: number; permissionId: number }[] =
      [];

    for (const perm of rolePermissions) {
      const dbPermission = databasePermissions.find(
        (p) => p.resource === perm.resource && p.action === perm.action,
      );

      if (dbPermission) {
        rolePermissionRecords.push({
          roleId: role.id,
          permissionId: dbPermission.id,
        });
      } else {
        console.warn(
          `⚠️  Permission not found: ${perm.resource}:${perm.action}`,
        );
      }
    }

    // Create role permissions
    if (rolePermissionRecords.length > 0) {
      await tx.rolePermission.createMany({
        data: rolePermissionRecords,
        skipDuplicates: true,
      });

      console.log(
        `✅ Assigned ${rolePermissionRecords.length} permissions to ${configKey} role`,
      );
    }
  }

  return {
    totalPermissions: databasePermissions.length,
    assignedRoles: rolesToProcess.length,
  };
};
