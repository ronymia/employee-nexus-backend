import { registerEnumType } from '@nestjs/graphql';

export enum AdjustmentType {
  EARNING = 'EARNING',
  DEDUCTION = 'DEDUCTION',
}

registerEnumType(AdjustmentType, {
  name: 'AdjustmentType',
  description: 'Type of payslip adjustment - EARNING or DEDUCTION',
});
