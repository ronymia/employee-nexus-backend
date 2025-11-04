import { InputType, Int, Field } from '@nestjs/graphql';
import { IsArray, IsInt, IsString } from 'class-validator';

@InputType()
export class CreateSubscriptionPlanInput {
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
    description: 'Module Ids for the service plan',
  })
  @IsArray()
  featureIds: number[];
}
