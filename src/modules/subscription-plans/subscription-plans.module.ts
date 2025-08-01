import { Module } from '@nestjs/common';
import { SubscriptionPlansService } from './subscription-plans.service';
import { SubscriptionPlansResolver } from './subscription-plans.resolver';

@Module({
  providers: [SubscriptionPlansResolver, SubscriptionPlansService],
})
export class SubscriptionPlansModule {}
