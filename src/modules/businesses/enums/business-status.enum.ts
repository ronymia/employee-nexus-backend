import { registerEnumType } from '@nestjs/graphql';

export enum BusinessStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  TRIAL_EXPIRED = 'TRIAL_EXPIRED',
}

registerEnumType(BusinessStatus, {
  name: 'BusinessStatus',
  description: 'Status of business',
});
