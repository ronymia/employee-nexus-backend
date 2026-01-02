import { Module } from '@nestjs/common';
import { BusinessSubscriptionsService } from './business-subscriptions.service';
import { BusinessSubscriptionsResolver } from './business-subscriptions.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [BusinessSubscriptionsResolver, BusinessSubscriptionsService],
  exports: [BusinessSubscriptionsService],
})
export class BusinessSubscriptionsModule {}
