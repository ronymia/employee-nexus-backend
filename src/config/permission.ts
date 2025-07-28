export const superAdminPermissions = [
  {
    resource: 'User',
    action: ['create', 'read', 'update', 'delete'],
  },
  {
    resource: 'Business',
    action: ['create', 'read', 'update', 'delete'],
  },
  {
    resource: 'Service Plan',
    action: ['create', 'read', 'update', 'delete'],
  },
  {
    resource: 'Role',
    action: ['create', 'read', 'update', 'delete'],
  },
  {
    resource: 'Module',
    action: ['create', 'read', 'update', 'delete'],
  },
];
export const businessOwnerPermissions = [
  {
    resource: 'User',
    action: ['create', 'read', 'update', 'delete'],
  },
  {
    resource: 'Business',
    action: ['read', 'update'],
  },
  {
    resource: 'Role',
    action: ['read'],
  },
  {
    resource: 'Module',
    action: ['read'],
  },
  {
    resource: 'Employment Status',
    action: ['create', 'read', 'update', 'delete'],
  },
  {
    resource: 'Designation',
    action: ['create', 'read', 'update', 'delete'],
  },
  {
    resource: 'Job Type',
    action: ['create', 'read', 'update', 'delete'],
  },
  {
    resource: 'Job Platform',
    action: ['create', 'read', 'update', 'delete'],
  },
  {
    resource: 'Job Platform',
    action: ['create', 'read', 'update', 'delete'],
  },
  {
    resource: 'Recruitment Process',
    action: ['create', 'read', 'update', 'delete'],
  },
  {
    resource: 'Onboarding Process',
    action: ['create', 'read', 'update', 'delete'],
  },
  {
    resource: 'Work Site',
    action: ['create', 'read', 'update', 'delete'],
  },
  {
    resource: 'Work Schedule',
    action: ['create', 'read', 'update', 'delete'],
  },
  {
    resource: 'Department',
    action: ['create', 'read', 'update', 'delete'],
  },
];

export const adminPermissions = [];

export const managerPermissions = [];

export const employeePermissions = [];

// ALL PERMISSION
export const permissions = [
  {
    resource: 'Service Plan',
    action: ['create', 'read', 'update', 'delete'],
  },
];
