import { ObjectType, Field, Int } from '@nestjs/graphql';
import { ServicePlan } from 'src/modules/service-plans/entities/service-plan.entity';
import { SystemModule } from 'src/modules/system-modules/entities/system-module.entity';

@ObjectType()
export class ServicePlanModule {
  @Field(() => Int, { description: 'Service Plan ID' })
  servicePlanId: number;

  @Field(() => ServicePlan, { description: 'Service Plan Details' })
  servicePlan: ServicePlan;

  @Field(() => Int, { description: 'System Module ID' })
  systemModuleId: number;

  @Field(() => SystemModule, { description: 'System Module Details' })
  systemModule: SystemModule;

  @Field(() => Boolean, { description: 'Module Is Enabled' })
  isEnabled: boolean;
}
