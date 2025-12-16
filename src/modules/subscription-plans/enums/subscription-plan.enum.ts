import { registerEnumType } from '@nestjs/graphql';

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  TRIAL = 'TRIAL',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}

registerEnumType(SubscriptionStatus, {
  name: 'SubscriptionStatus',
  description: 'Status of the Subscription Plan',
});
