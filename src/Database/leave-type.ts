import { LeaveRolloverType } from 'src/modules/leave-types/enums';

export const defaultLeaveTypes = [
  {
    name: 'Vacation Leave',
    leaveType: 'PAID',
    leaveHours: 80,
    leaveRolloverType: LeaveRolloverType.NONE,
    // employmentStatusIds: [],
  },
  {
    name: 'Sick Leave',
    leaveType: 'PAID',
    leaveHours: 40,
    leaveRolloverType: LeaveRolloverType.NONE,
    // employmentStatusIds: [],
  },
  {
    name: 'Personal Leave',
    leaveType: 'UNPAID',
    leaveHours: 30,
    leaveRolloverType: LeaveRolloverType.NONE,
    // employmentStatusIds: [],
  },
  {
    name: 'Maternity Leave',
    leaveType: 'PAID',
    leaveHours: 120,
    leaveRolloverType: LeaveRolloverType.NONE,
    // employmentStatusIds: [],
  },
  {
    name: 'Paternity Leave',
    leaveType: 'PAID',
    leaveHours: 80,
    leaveRolloverType: LeaveRolloverType.NONE,
    // employmentStatusIds: [],
  },
  {
    name: 'Bereavement Leave',
    leaveType: 'PAID',
    leaveHours: 24,
    leaveRolloverType: LeaveRolloverType.NONE,
    // employmentStatusIds: [],
  },
];
