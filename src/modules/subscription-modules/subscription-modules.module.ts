import { Module } from '@nestjs/common';
import { SubscriptionModulesService } from './subscription-modules.service';
import { SubscriptionModulesResolver } from './subscription-modules.resolver';

@Module({
  providers: [SubscriptionModulesResolver, SubscriptionModulesService],
})
export class SubscriptionModulesModule {}
