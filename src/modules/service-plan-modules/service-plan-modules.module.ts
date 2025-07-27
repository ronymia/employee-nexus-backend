import { Module } from '@nestjs/common';
import { ServicePlanModulesService } from './service-plan-modules.service';
import { ServicePlanModulesResolver } from './service-plan-modules.resolver';

@Module({
  providers: [ServicePlanModulesResolver, ServicePlanModulesService],
})
export class ServicePlanModulesModule {}
