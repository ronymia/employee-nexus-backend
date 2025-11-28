import { Module } from '@nestjs/common';
import { BusinessSettingsService } from './business-settings.service';
import { BusinessSettingsResolver } from './business-settings.resolver';

@Module({
  providers: [BusinessSettingsResolver, BusinessSettingsService],
})
export class BusinessSettingsModule {}
