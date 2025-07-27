import { Field, InputType, Int } from '@nestjs/graphql';
import { IsBoolean, IsInt } from 'class-validator';

@InputType()
export class ServicePlanModuleInput {
  @Field(() => Int)
  @IsInt()
  id: number;

  @Field()
  @IsBoolean()
  isEnabled: boolean;
}
