import { Module } from '@nestjs/common';
import { BusinessModulesService } from './business-modules.service';
import { BusinessModulesResolver } from './business-modules.resolver';

@Module({
  providers: [BusinessModulesResolver, BusinessModulesService],
})
export class BusinessModulesModule {}
