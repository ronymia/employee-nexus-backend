import { registerEnumType } from '@nestjs/graphql';

export enum ComponentType {
  EARNING = 'EARNING',
  DEDUCTION = 'DEDUCTION',
  EMPLOYER_COST = 'EMPLOYER_COST',
}

registerEnumType(ComponentType, {
  name: 'ComponentType',
  description: 'Type of payroll component',
});
