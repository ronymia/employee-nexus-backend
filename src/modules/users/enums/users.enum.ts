import { registerEnumType } from '@nestjs/graphql';

export enum MaritalStatus {
  SINGLE = 'SINGLE',
  MARRIED = 'MARRIED',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum UserAccountStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BLOCKED = 'BLOCKED',
  DELETED = 'DELETED',
  SUSPENDED = 'SUSPENDED',
  VERIFIED = 'VERIFIED',
  UNVERIFIED = 'UNVERIFIED',
  TERMINATED = 'TERMINATED',
  RESIGNED = 'RESIGNED',
  RETIRED = 'RETIRED',
  ON_LEAVE = 'ON_LEAVE',
}

registerEnumType(MaritalStatus, {
  name: 'MaritalStatus',
  description: 'Marital status of the user',
});

registerEnumType(Gender, {
  name: 'Gender',
  description: 'Gender of the user',
});

registerEnumType(UserAccountStatus, {
  name: 'UserAccountStatus',
  description: 'Account status of the user',
});
