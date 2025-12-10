import { Module } from '@nestjs/common';
import { OwnerDashboardService } from './owner-dashboard.service';
import { OwnerDashboardResolver } from './owner-dashboard.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [OwnerDashboardResolver, OwnerDashboardService],
})
export class OwnerDashboardModule {}
