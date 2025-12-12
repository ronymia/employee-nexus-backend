import { registerEnumType } from '@nestjs/graphql';

export enum LeaveRolloverType {
  NONE = 'NONE',
  PARTIAL_ROLLOVER = 'PARTIAL_ROLLOVER',
  FULL_ROLLOVER = 'FULL_ROLLOVER',
}

registerEnumType(LeaveRolloverType, {
  name: 'LeaveRolloverType',
  description: 'Types of leave rollover policies',
});

// LEAVE TYPE ENUM - DEFINES PAID AND UNPAID LEAVE TYPES
export enum LeaveTypeEnum {
  PAID = 'PAID',
  UNPAID = 'UNPAID',
}

registerEnumType(LeaveTypeEnum, {
  name: 'LeaveTypeEnum',
  description: 'Type of leave - paid or unpaid',
});
