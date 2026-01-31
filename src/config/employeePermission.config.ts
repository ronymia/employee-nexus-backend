import {
  PermissionAction,
  PermissionResource,
} from 'src/constants/permissions.constant';

export const employeePermissions = [
  {
    resource: PermissionResource.USER,
    action: [PermissionAction.READ],
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
    action: [PermissionAction.READ],
  },
  {
    resource: PermissionResource.DESIGNATION,
    action: [PermissionAction.READ],
  },
  {
    resource: PermissionResource.BUSINESS_SUBSCRIPTION,
    action: [PermissionAction.READ],
  },
];
