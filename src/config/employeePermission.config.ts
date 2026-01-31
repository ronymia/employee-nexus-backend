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
  {
    resource: PermissionResource.WORK_SITE,
    action: [PermissionAction.READ],
  },
  {
    resource: PermissionResource.WORK_SCHEDULE,
    action: [PermissionAction.READ],
  },
  {
    resource: PermissionResource.DEPARTMENT,
    action: [PermissionAction.READ],
  },
  {
    resource: PermissionResource.LEAVE_TYPE,
    action: [PermissionAction.READ],
  },
  {
    resource: PermissionResource.ASSET_TYPE,
    action: [PermissionAction.READ],
  },
  {
    resource: PermissionResource.ASSET,
    action: [PermissionAction.READ],
  },
  {
    resource: PermissionResource.PROJECT,
    action: [PermissionAction.READ],
  },
  {
    resource: PermissionResource.PROJECT_MEMBER,
    action: [PermissionAction.READ],
  },
  {
    resource: PermissionResource.ATTENDANCE_SETTINGS,
    action: [PermissionAction.READ],
  },
  {
    resource: PermissionResource.LEAVE_SETTINGS,
    action: [PermissionAction.READ],
  },
  {
    resource: PermissionResource.BUSINESS_SETTINGS,
    action: [PermissionAction.READ],
  },
  {
    resource: PermissionResource.DOCUMENT,
    action: [PermissionAction.CREATE, PermissionAction.READ],
  },
  {
    resource: PermissionResource.NOTE,
    action: [
      PermissionAction.CREATE,
      PermissionAction.READ,
      PermissionAction.UPDATE,
      PermissionAction.DELETE,
    ],
  },
  {
    resource: PermissionResource.SOCIAL_LINK,
    action: [PermissionAction.READ],
  },
  {
    resource: PermissionResource.ATTENDANCE,
    action: [PermissionAction.CREATE, PermissionAction.READ],
  },
  {
    resource: PermissionResource.LEAVE,
    action: [
      PermissionAction.CREATE,
      PermissionAction.READ,
      PermissionAction.UPDATE,
    ],
  },
  {
    resource: PermissionResource.HOLIDAY,
    action: [PermissionAction.READ],
  },
  {
    resource: PermissionResource.PAYROLL_COMPONENT,
    action: [PermissionAction.READ],
  },
  {
    resource: PermissionResource.PAYROLL_ADJUSTMENT,
    action: [PermissionAction.READ],
  },
  {
    resource: PermissionResource.PAYROLL,
    action: [PermissionAction.READ],
  },
  {
    resource: PermissionResource.PAYROLL_CYCLE,
    action: [PermissionAction.READ],
  },
  {
    resource: PermissionResource.PAYROLL_ITEM,
    action: [PermissionAction.READ],
  },
  {
    resource: PermissionResource.SALARY,
    action: [PermissionAction.READ],
  },
  {
    resource: PermissionResource.PROFILE,
    action: [PermissionAction.READ, PermissionAction.UPDATE],
  },
  {
    resource: PermissionResource.EDUCATION_HISTORY,
    action: [
      PermissionAction.CREATE,
      PermissionAction.READ,
      PermissionAction.UPDATE,
      PermissionAction.DELETE,
    ],
  },
  {
    resource: PermissionResource.JOB_HISTORY,
    action: [
      PermissionAction.CREATE,
      PermissionAction.READ,
      PermissionAction.UPDATE,
      PermissionAction.DELETE,
    ],
  },
  {
    resource: PermissionResource.EMERGENCY_CONTACT,
    action: [
      PermissionAction.CREATE,
      PermissionAction.READ,
      PermissionAction.UPDATE,
      PermissionAction.DELETE,
    ],
  },
  {
    resource: PermissionResource.EMPLOYMENT_DETAILS,
    action: [PermissionAction.READ],
  },
  {
    resource: PermissionResource.NOTIFICATION,
    action: [PermissionAction.READ, PermissionAction.UPDATE],
  },
  {
    resource: PermissionResource.NOTIFICATION_TEMPLATE,
    action: [PermissionAction.READ],
  },
];
