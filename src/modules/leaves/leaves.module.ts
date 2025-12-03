import { Module } from '@nestjs/common';
import { LeavesService } from './leaves.service';
import { LeavesResolver } from './leaves.resolver';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [PrismaModule, NotificationsModule],
  providers: [LeavesResolver, LeavesService],
})
export class LeavesModule {}
