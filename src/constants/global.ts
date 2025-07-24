import { BLOOD_GROUP } from 'src/enums';

export const blood_group: BLOOD_GROUP[] = [
  BLOOD_GROUP.A_POSITIVE,
  BLOOD_GROUP.A_NEGATIVE,
  BLOOD_GROUP.B_POSITIVE,
  BLOOD_GROUP.B_NEGATIVE,
  BLOOD_GROUP.AB_POSITIVE,
  BLOOD_GROUP.AB_NEGATIVE,
  BLOOD_GROUP.O_POSITIVE,
  BLOOD_GROUP.O_NEGATIVE,
];

export const paginationFields = ['page', 'limit', 'sortBy', 'sortOrder'];
