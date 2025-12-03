import { registerEnumType } from '@nestjs/graphql';

export enum PayrollItemStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  PAID = 'PAID',
  ON_HOLD = 'ON_HOLD',
  CANCELLED = 'CANCELLED',
}

registerEnumType(PayrollItemStatus, {
  name: 'PayrollItemStatus',
  description: 'Status of payroll item',
});
