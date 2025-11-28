import { Module } from '@nestjs/common';
import { LeaveSettingsService } from './leave-settings.service';
import { LeaveSettingsResolver } from './leave-settings.resolver';

@Module({
  providers: [LeaveSettingsResolver, LeaveSettingsService],
})
export class LeaveSettingsModule {}
