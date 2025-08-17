import { Module } from '@nestjs/common';
import { SystemModulesService } from './system-modules.service';
import { SystemModulesResolver } from './system-modules.resolver';

@Module({
  providers: [SystemModulesResolver, SystemModulesService],
})
export class SystemModulesModule {}
