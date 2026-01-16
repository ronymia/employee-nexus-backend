import { Module } from '@nestjs/common';
import { BusinessSubscriptionsService } from './business-subscriptions.service';
import { BusinessSubscriptionsResolver } from './business-subscriptions.resolver';
import { PrismaModule } from '../prisma/prisma.module';
import { SubscriptionStatusCron } from './cron/subscription-status.cron';
import './enums/index'; // Register GraphQL enum

@Module({
  imports: [PrismaModule],
  providers: [
    BusinessSubscriptionsResolver,
    BusinessSubscriptionsService,
    SubscriptionStatusCron,
  ],
  exports: [BusinessSubscriptionsService],
})
export class BusinessSubscriptionsModule {}
