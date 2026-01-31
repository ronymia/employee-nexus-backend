import { registerEnumType } from '@nestjs/graphql';

export enum AdjustmentStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  APPLIED = 'APPLIED',
  CANCELLED = 'CANCELLED',
}

registerEnumType(AdjustmentStatus, {
  name: 'AdjustmentStatus',
  description:
    'Status of payslip adjustment - PENDING, APPROVED, REJECTED, APPLIED, or CANCELLED',
});
