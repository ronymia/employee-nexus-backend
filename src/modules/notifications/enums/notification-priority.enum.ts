import { registerEnumType } from '@nestjs/graphql';
import { NotificationPriority } from 'generated/prisma';

registerEnumType(NotificationPriority, {
  name: 'NotificationPriority',
});
