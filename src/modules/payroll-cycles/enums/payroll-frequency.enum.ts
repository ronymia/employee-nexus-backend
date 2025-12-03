import { registerEnumType } from '@nestjs/graphql';

export enum PayrollFrequency {
  WEEKLY = 'WEEKLY',
  BI_WEEKLY = 'BI_WEEKLY',
  SEMI_MONTHLY = 'SEMI_MONTHLY',
  MONTHLY = 'MONTHLY',
}

registerEnumType(PayrollFrequency, {
  name: 'PayrollFrequency',
  description: 'Frequency of payroll cycles',
});
