import { registerEnumType } from '@nestjs/graphql';

// Re-export Prisma's generated enum (don't redefine it)
import { BusinessSubscriptionStatus } from 'generated/prisma';
export { BusinessSubscriptionStatus } from 'generated/prisma';

// Register it for GraphQL
registerEnumType(BusinessSubscriptionStatus, {
  name: 'BusinessSubscriptionStatus',
  description: 'status of business subscription plan',
});
