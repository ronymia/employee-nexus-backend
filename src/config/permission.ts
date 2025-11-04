// ALL PERMISSION
export const permissions = [
  {
    resource: 'Subscription Plan',
    action: ['create', 'read', 'update', 'delete'],
  },
  {
    resource: 'User',
    action: ['create', 'read', 'update', 'delete'],
  },
  {
    resource: 'Business',
    action: ['create', 'read', 'update', 'delete'],
  },
  {
    resource: 'Role',
    action: ['read'],
  },
  {
    resource: 'Feature',
    action: ['read', 'update'],
  },
  {
    resource: 'Permission',
    action: ['create', 'read', 'update', 'delete'],
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

// ALL SUPER ADMIN PERMISSION
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
    resource: 'Subscription Plan',
    action: ['create', 'read', 'update', 'delete'],
  },
  {
    resource: 'Role',
    action: ['read'],
  },
  {
    resource: 'Feature',
    action: ['read'],
  },
  {
    resource: 'Permission',
    action: ['create', 'read', 'update', 'delete'],
  },
  {
    resource: 'Subscription Plan',
    action: ['create', 'read', 'update', 'delete'],
  },
];

// ALL BUSINESS OWNER PERMISSION
export const ownerPermissions = [
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
    resource: 'Feature',
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

export const adminPermissions = [
  {
    resource: 'Department',
    action: ['create', 'read', 'update', 'delete'],
  },
];

export const managerPermissions = [
  {
    resource: 'Department',
    action: ['create', 'read', 'update', 'delete'],
  },
];

export const employeePermissions = [
  {
    resource: 'Department',
    action: ['read'],
  },
];
