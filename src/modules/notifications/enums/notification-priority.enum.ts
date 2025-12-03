import { registerEnumType } from '@nestjs/graphql';

export enum NotificationPriority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

registerEnumType(NotificationPriority, {
  name: 'NotificationPriority',
});
