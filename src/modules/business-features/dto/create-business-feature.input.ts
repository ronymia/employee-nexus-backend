import { InputType, Int, Field } from '@nestjs/graphql';
import { IsInt } from 'class-validator';

@InputType()
export class CreateBusinessFeatureInput {
  @Field(() => Int, { description: 'Business ID' })
  @IsInt()
  businessId: number;

  @Field(() => Int, { description: 'Feature ID' })
  @IsInt()
  featureId: number;
}
