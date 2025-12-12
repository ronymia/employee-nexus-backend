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
