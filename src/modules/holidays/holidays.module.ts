import { Module } from '@nestjs/common';
import { HolidaysService } from './holidays.service';
import { HolidaysResolver } from './holidays.resolver';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [PrismaModule, NotificationsModule],
  providers: [HolidaysResolver, HolidaysService],
})
export class HolidaysModule {}
