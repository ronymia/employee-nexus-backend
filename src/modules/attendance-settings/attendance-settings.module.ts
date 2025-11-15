import { Module } from '@nestjs/common';
import { AttendanceSettingsService } from './attendance-settings.service';
import { AttendanceSettingsResolver } from './attendance-settings.resolver';

@Module({
  providers: [AttendanceSettingsResolver, AttendanceSettingsService],
})
export class AttendanceSettingsModule {}
