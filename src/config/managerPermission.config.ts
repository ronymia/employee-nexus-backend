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
    resource: PermissionResource.JOB_TYPE,
    action: [PermissionAction.READ],
  },
  {
    resource: PermissionResource.JOB_PLATFORM,
    action: [PermissionAction.READ],
  },
  {
    resource: PermissionResource.RECRUITMENT_PROCESS,
    action: [PermissionAction.READ, PermissionAction.UPDATE],
  },
  {
    resource: PermissionResource.ONBOARDING_PROCESS,
    action: [PermissionAction.READ, PermissionAction.UPDATE],
  },
  {
    resource: PermissionResource.WORK_SITE,
    action: [PermissionAction.READ, PermissionAction.UPDATE],
  },
  {
    resource: PermissionResource.WORK_SCHEDULE,
    action: [PermissionAction.READ, PermissionAction.UPDATE],
  },
  {
    resource: PermissionResource.DEPARTMENT,
    action: [
      PermissionAction.CREATE,
      PermissionAction.READ,
      PermissionAction.UPDATE,
      PermissionAction.DELETE,
    ],
  },
  {
    resource: PermissionResource.LEAVE_TYPE,
    action: [PermissionAction.READ, PermissionAction.UPDATE],
  },
  {
    resource: PermissionResource.ASSET_TYPE,
    action: [PermissionAction.READ, PermissionAction.UPDATE],
  },
  {
    resource: PermissionResource.ASSET,
    action: [PermissionAction.READ, PermissionAction.UPDATE],
  },
  {
    resource: PermissionResource.ATTENDANCE_SETTINGS,
    action: [PermissionAction.READ, PermissionAction.UPDATE],
  },
  {
    resource: PermissionResource.LEAVE_SETTINGS,
    action: [PermissionAction.READ, PermissionAction.UPDATE],
  },
  {
    resource: PermissionResource.BUSINESS_SETTINGS,
    action: [PermissionAction.READ, PermissionAction.UPDATE],
  },
];
