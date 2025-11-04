import { Module } from '@nestjs/common';
import { BusinessFeaturesService } from './business-features.service';
import { BusinessFeaturesResolver } from './business-features.resolver';

@Module({
  providers: [BusinessFeaturesResolver, BusinessFeaturesService],
})
export class BusinessFeaturesModule {}
