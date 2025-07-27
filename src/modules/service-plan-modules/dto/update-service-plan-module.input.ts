import { IsBoolean, IsInt } from 'class-validator';
import { CreateServicePlanModuleInput } from './create-service-plan-module.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateServicePlanModuleInput extends PartialType(
  CreateServicePlanModuleInput,
) {
  @Field(() => Int, { description: 'Service Plan ID' })
  @IsInt()
  servicePlanId: number;

  @Field(() => Int, { description: 'System Module ID' })
  @IsInt()
  systemModuleId: number;

  @Field(() => Boolean, { description: 'Module Is Enabled' })
  @IsBoolean()
  isEnabled: boolean;
}
