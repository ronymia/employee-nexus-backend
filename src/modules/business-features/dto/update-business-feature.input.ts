import { IsBoolean, IsInt } from 'class-validator';
import { CreateBusinessFeatureInput } from './create-business-feature.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateBusinessFeatureInput extends PartialType(
  CreateBusinessFeatureInput,
) {
  @Field(() => Int, { description: 'Business ID' })
  @IsInt()
  businessId: number;

  @Field(() => Int, { description: 'Feature ID' })
  @IsInt()
  featureId: number;

  @Field(() => Boolean, { description: 'Is Enabled' })
  @IsBoolean()
  isEnabled: boolean;
}
