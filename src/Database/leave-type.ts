import { LeaveRolloverType } from 'src/modules/leave-types/enums';

export const defaultLeaveTypes = [
  {
    name: 'Vacation Leave',
    leaveType: 'PAID',
    leaveMinutes: 1440,
    leaveRolloverType: LeaveRolloverType.NONE,
    // employmentStatusIds: [],
  },
  {
    name: 'Sick Leave',
    leaveType: 'PAID',
    leaveMinutes: 4800,
    leaveRolloverType: LeaveRolloverType.NONE,
    // employmentStatusIds: [],
  },
  {
    name: 'Personal Leave',
    leaveType: 'UNPAID',
    leaveMinutes: 0,
    leaveRolloverType: LeaveRolloverType.NONE,
    // employmentStatusIds: [],
  },
  {
    name: 'Maternity Leave',
    leaveType: 'PAID',
    leaveMinutes: 7200,
    leaveRolloverType: LeaveRolloverType.NONE,
    // employmentStatusIds: [],
  },
  {
    name: 'Paternity Leave',
    leaveType: 'PAID',
    leaveMinutes: 4800,
    leaveRolloverType: LeaveRolloverType.NONE,
    // employmentStatusIds: [],
  },
  {
    name: 'Bereavement Leave',
    leaveType: 'PAID',
    leaveMinutes: 1440,
    leaveRolloverType: LeaveRolloverType.NONE,
    // employmentStatusIds: [],
  },
];
