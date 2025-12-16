import { registerEnumType } from '@nestjs/graphql';

export enum Status {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DEACTIVATED = 'DEACTIVATED',
}

registerEnumType(Status, {
  name: 'Status',
  description: 'Status of an entity',
});

export enum EntityStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DEACTIVATED = 'DEACTIVATED',
  ARCHIVED = 'ARCHIVED',
  DRAFT = 'DRAFT',
}

registerEnumType(EntityStatus, {
  name: 'EntityStatus',
  description: 'EntityStatus of an entity',
});
