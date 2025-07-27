import {
  IsArray,
  IsBoolean,
  IsInt,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateServicePlanInput } from './create-service-plan.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { ServicePlanModuleInput } from './service-plan-module.input';

@InputType()
export class UpdateServicePlanInput extends PartialType(
  CreateServicePlanInput,
) {
  // @Field(() => ID, { description: 'Unique identifier for the service plan' })
  // @IsInt()
  // id: number;

  @Field({ description: 'Name of the service plan' })
  @IsString()
  name: string;

  @Field({ description: 'Description of the service plan' })
  @IsString()
  description: string;

  @Field(() => Int, { description: 'One-time setup fee for the service plan' })
  @IsInt()
  setupFee: number;

  @Field(() => String, {
    description: 'Status of the service plan',
    defaultValue: 'ACTIVE',
  })
  @IsString()
  status: string;

  @Field(() => Int, { description: 'Price of the service plan' })
  @IsInt()
  price: number;

  @Field(() => [ServicePlanModuleInput], {
    description: 'Modules for the service plan',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServicePlanModuleInput)
  moduleIds: ServicePlanModuleInput[];
}
