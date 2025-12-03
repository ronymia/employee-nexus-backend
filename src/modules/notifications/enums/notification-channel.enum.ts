import { registerEnumType } from '@nestjs/graphql';
import { NotificationChannel } from 'generated/prisma';

registerEnumType(NotificationChannel, {
  name: 'NotificationChannel',
});
