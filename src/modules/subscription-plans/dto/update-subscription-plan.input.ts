import { IsArray, IsInt, IsString } from 'class-validator';
import { CreateSubscriptionPlanInput } from './create-subscription-plan.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateSubscriptionPlanInput extends PartialType(
  CreateSubscriptionPlanInput,
) {
  @Field({ description: 'Name of the service plan' })
  @IsString()
  name: string;

  @Field({ description: 'Description of the service plan' })
  @IsString()
  description: string;

  @Field(() => Int, { description: 'One-time setup fee for the service plan' })
  @IsInt()
  setupFee: number;

  @Field(() => Int, { description: 'Price of the service plan' })
  @IsInt()
  price: number;

  @Field(() => [Int], {
    description: 'Modules for the service plan',
  })
  @IsArray()
  featureIds: number[];
}
