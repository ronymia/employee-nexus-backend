import { registerEnumType } from '@nestjs/graphql';

export enum NotificationType {
  SYSTEM = 'SYSTEM',
  ATTENDANCE = 'ATTENDANCE',
  LEAVE = 'LEAVE',
  PAYROLL = 'PAYROLL',
  ASSET = 'ASSET',
  PROJECT = 'PROJECT',
  DOCUMENT = 'DOCUMENT',
  HOLIDAY = 'HOLIDAY',
  SCHEDULE = 'SCHEDULE',
  ANNOUNCEMENT = 'ANNOUNCEMENT',
}

registerEnumType(NotificationType, {
  name: 'NotificationType',
});
