import {
  PermissionAction,
  PermissionResource,
} from 'src/constants/permissions.constant';

// ALL BUSINESS OWNER PERMISSION
export const ownerPermissions = [
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
    action: [PermissionAction.READ, PermissionAction.UPDATE],
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
    action: [
      PermissionAction.CREATE,
      PermissionAction.READ,
      PermissionAction.UPDATE,
      PermissionAction.DELETE,
    ],
  },
  {
    resource: PermissionResource.DESIGNATION,
    action: [
      PermissionAction.CREATE,
      PermissionAction.READ,
      PermissionAction.UPDATE,
      PermissionAction.DELETE,
    ],
  },
  {
    resource: PermissionResource.JOB_TYPE,
    action: [
      PermissionAction.CREATE,
      PermissionAction.READ,
      PermissionAction.UPDATE,
      PermissionAction.DELETE,
    ],
  },
  {
    resource: PermissionResource.JOB_PLATFORM,
    action: [
      PermissionAction.CREATE,
      PermissionAction.READ,
      PermissionAction.UPDATE,
      PermissionAction.DELETE,
    ],
  },
  {
    resource: PermissionResource.RECRUITMENT_PROCESS,
    action: [
      PermissionAction.CREATE,
      PermissionAction.READ,
      PermissionAction.UPDATE,
      PermissionAction.DELETE,
    ],
  },
  {
    resource: PermissionResource.ONBOARDING_PROCESS,
    action: [
      PermissionAction.CREATE,
      PermissionAction.READ,
      PermissionAction.UPDATE,
      PermissionAction.DELETE,
    ],
  },
  {
    resource: PermissionResource.WORK_SITE,
    action: [
      PermissionAction.CREATE,
      PermissionAction.READ,
      PermissionAction.UPDATE,
      PermissionAction.DELETE,
    ],
  },
  {
    resource: PermissionResource.WORK_SCHEDULE,
    action: [
      PermissionAction.CREATE,
      PermissionAction.READ,
      PermissionAction.UPDATE,
      PermissionAction.DELETE,
    ],
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
    action: [
      PermissionAction.CREATE,
      PermissionAction.READ,
      PermissionAction.UPDATE,
      PermissionAction.DELETE,
    ],
  },
  {
    resource: PermissionResource.ATTENDANCE_SETTINGS,
    action: [
      PermissionAction.CREATE,
      PermissionAction.READ,
      PermissionAction.UPDATE,
      PermissionAction.DELETE,
    ],
  },
  {
    resource: PermissionResource.LEAVE_SETTINGS,
    action: [
      PermissionAction.CREATE,
      PermissionAction.READ,
      PermissionAction.UPDATE,
      PermissionAction.DELETE,
    ],
  },
  {
    resource: PermissionResource.BUSINESS_SETTINGS,
    action: [
      PermissionAction.CREATE,
      PermissionAction.READ,
      PermissionAction.UPDATE,
      PermissionAction.DELETE,
    ],
  },
];
