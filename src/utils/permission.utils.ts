export class PermissionUtils {
  /**
   * Format permissions from user data
   */
  static formatUserPermissions(user: {
    role?: {
      rolePermissions?: Array<{
        permission?: { resource: string; action: string };
      }>;
    } | null;
    userPermissions?: Array<{
      permission?: { resource: string; action: string };
    }>;
  }): string[] {
    const permissionsSet = new Set<string>();

    // Get permissions from role
    user.role?.rolePermissions?.forEach((rp) => {
      if (rp.permission) {
        permissionsSet.add(`${rp.permission.resource}:${rp.permission.action}`);
      }
    });

    // Get direct user permissions
    user.userPermissions?.forEach((up) => {
      if (up.permission) {
        permissionsSet.add(`${up.permission.resource}:${up.permission.action}`);
      }
    });

    return Array.from(permissionsSet);
  }

  /**
   * Check if user has specific permission
   */
  static hasPermission(
    permissions: string[],
    resource: string,
    action: string,
  ): boolean {
    return permissions.includes(`${resource}:${action}`);
  }
}
