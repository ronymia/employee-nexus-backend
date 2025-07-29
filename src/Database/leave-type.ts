import { LeaveRolloverType } from 'generated/prisma';

export const defaultLeaveTypes = [
  {
    name: 'Vacation Leave',
    leaveType: 'paid',
    leaveHours: 80,
    leaveRolloverType: LeaveRolloverType.NONE,
    // employmentStatusIds: [],
  },
  {
    name: 'Sick Leave',
    leaveType: 'paid',
    leaveHours: 40,
    leaveRolloverType: LeaveRolloverType.NONE,
    // employmentStatusIds: [],
  },
  {
    name: 'Personal Leave',
    leaveType: 'unpaid',
    leaveHours: 30,
    leaveRolloverType: LeaveRolloverType.NONE,
    // employmentStatusIds: [],
  },
  {
    name: 'Maternity Leave',
    leaveType: 'paid',
    leaveHours: 120,
    leaveRolloverType: LeaveRolloverType.NONE,
    // employmentStatusIds: [],
  },
  {
    name: 'Paternity Leave',
    leaveType: 'paid',
    leaveHours: 80,
    leaveRolloverType: LeaveRolloverType.NONE,
    // employmentStatusIds: [],
  },
  {
    name: 'Bereavement Leave',
    leaveType: 'paid',
    leaveHours: 24,
    leaveRolloverType: LeaveRolloverType.NONE,
    // employmentStatusIds: [],
  },
];
