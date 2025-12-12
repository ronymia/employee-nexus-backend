import { registerEnumType } from '@nestjs/graphql';

export enum LeaveDuration {
  SINGLE_DAY = 'SINGLE_DAY',
  MULTI_DAY = 'MULTI_DAY',
  HALF_DAY = 'HALF_DAY',
}

registerEnumType(LeaveDuration, {
  name: 'LeaveDuration',
  description: 'Duration type of the leave',
});
