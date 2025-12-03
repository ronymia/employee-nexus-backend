import { registerEnumType } from '@nestjs/graphql';

export enum CalculationType {
  FIXED_AMOUNT = 'FIXED_AMOUNT',
  PERCENTAGE_OF_BASIC = 'PERCENTAGE_OF_BASIC',
  PERCENTAGE_OF_GROSS = 'PERCENTAGE_OF_GROSS',
  HOURLY_RATE = 'HOURLY_RATE',
}

registerEnumType(CalculationType, {
  name: 'CalculationType',
  description: 'Calculation method for payroll component',
});
