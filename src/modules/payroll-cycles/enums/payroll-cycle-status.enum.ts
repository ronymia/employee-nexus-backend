import { registerEnumType } from '@nestjs/graphql';

export enum PayrollCycleStatus {
  DRAFT = 'DRAFT',
  PROCESSING = 'PROCESSING',
  APPROVED = 'APPROVED',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
}

registerEnumType(PayrollCycleStatus, {
  name: 'PayrollCycleStatus',
  description: 'Status of payroll cycle',
});
