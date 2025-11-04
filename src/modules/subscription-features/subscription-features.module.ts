import { Module } from '@nestjs/common';
import { SubscriptionFeaturesService } from './subscription-features.service';
import { SubscriptionFeaturesResolver } from './subscription-features.resolver';

@Module({
  providers: [SubscriptionFeaturesResolver, SubscriptionFeaturesService],
})
export class SubscriptionFeaturesModule {}
