import {
  PermissionAction,
  PermissionResource,
} from 'src/constants/permissions.constant';

// ALL SUPER ADMIN PERMISSION
export const superAdminPermissions = [
  {
    resource: PermissionResource.USER,
    action: [
      PermissionAction.CREATE,
      PermissionAction.READ,
      PermissionAction.UPDATE,
      PermissionAction.DELETE,
    ],
  },
  {
    resource: PermissionResource.BUSINESS,
    action: [
      PermissionAction.CREATE,
      PermissionAction.READ,
      PermissionAction.UPDATE,
      PermissionAction.DELETE,
    ],
  },
  {
    resource: PermissionResource.SUBSCRIPTION_PLAN,
    action: [
      PermissionAction.CREATE,
      PermissionAction.READ,
      PermissionAction.UPDATE,
      PermissionAction.DELETE,
    ],
  },
  {
    resource: PermissionResource.ROLE,
    action: [PermissionAction.READ],
  },
  // {
  //   resource: PermissionResource.FEATURE,
  //   action: [PermissionAction.READ],
  // },
  {
    resource: PermissionResource.PERMISSION,
    action: [
      PermissionAction.CREATE,
      PermissionAction.READ,
      PermissionAction.UPDATE,
      PermissionAction.DELETE,
    ],
  },
];
