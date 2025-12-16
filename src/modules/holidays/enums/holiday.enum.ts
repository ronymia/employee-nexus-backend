import { registerEnumType } from '@nestjs/graphql';

export enum HolidayType {
  PUBLIC = 'PUBLIC',
  RELIGIOUS = 'RELIGIOUS',
  COMPANY_SPECIFIC = 'COMPANY_SPECIFIC',
  REGIONAL = 'REGIONAL',
}

registerEnumType(HolidayType, {
  name: 'HolidayType',
  description: 'Type of holiday',
});
