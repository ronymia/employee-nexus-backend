import {
  PermissionAction,
  PermissionResource,
} from 'src/constants/permissions.constant';

export const managerPermissions = [
  {
    resource: PermissionResource.USER,
    action: [PermissionAction.READ, PermissionAction.UPDATE],
  },
  {
    resource: PermissionResource.BUSINESS,
    action: [PermissionAction.READ],
  },
  {
    resource: PermissionResource.ROLE,
    action: [PermissionAction.READ],
  },
  {
    resource: PermissionResource.FEATURE,
    action: [PermissionAction.READ],
  },
  {
    resource: PermissionResource.EMPLOYMENT_STATUS,
    action: [PermissionAction.READ, PermissionAction.UPDATE],
  },
  {
    resource: PermissionResource.DESIGNATION,
    action: [PermissionAction.READ, PermissionAction.UPDATE],
  },
  {
    resource: PermissionResource.BUSINESS_SUBSCRIPTION,
    action: [PermissionAction.READ],
  },
];
