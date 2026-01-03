import { Module } from '@nestjs/common';
import { AttendancesService } from './attendances.service';
import { AttendancesResolver } from './attendances.resolver';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [PrismaModule, NotificationsModule],
  providers: [AttendancesResolver, AttendancesService],
  exports: [AttendancesService],
})
export class AttendancesModule {}
