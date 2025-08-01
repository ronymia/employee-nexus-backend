import { Module } from '@nestjs/common';
import { ModulesService } from './modules.service';
import { ModulesResolver } from './modules.resolver';

@Module({
  providers: [ModulesResolver, ModulesService],
})
export class ModulesModule {}
