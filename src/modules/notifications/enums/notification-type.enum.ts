import { registerEnumType } from '@nestjs/graphql';
import { NotificationType } from 'generated/prisma';

registerEnumType(NotificationType, {
  name: 'NotificationType',
});
