import { registerEnumType } from '@nestjs/graphql';

export enum BusinessSubscriptionStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  TRIAL = 'TRIAL',
  EXPIRED = 'EXPIRED',
  SUSPENDED = 'SUSPENDED',
  CANCELLED = 'CANCELLED',
  PENDING = 'PENDING',
}

registerEnumType(BusinessSubscriptionStatus, {
  name: 'BusinessSubscriptionStatusonStatus',
  description: 'Status of the Subscription Plan',
});
