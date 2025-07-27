import { InputType, Field, Int } from '@nestjs/graphql';
import { IsBoolean, IsInt } from 'class-validator';

@InputType()
export class CreateServicePlanModuleInput {
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
