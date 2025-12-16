import { registerEnumType } from '@nestjs/graphql';

export enum NotificationChannel {
  IN_APP = 'IN_APP',
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  PUSH = 'PUSH',
}

registerEnumType(NotificationChannel, {
  name: 'NotificationChannel',
});
