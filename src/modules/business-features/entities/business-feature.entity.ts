import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Business } from 'src/modules/businesses/entities/business.entity';
import { Feature } from 'src/modules/features/entities/features.entity';

@ObjectType()
export class BusinessFeature {
  @Field(() => Int, { description: 'Business ID' })
  businessId: number;

  @Field(() => Business, { description: 'Business' })
  business: Business;

  @Field(() => Int, { description: 'Feature ID' })
  featureId: number;

  @Field(() => Feature, { description: 'Feature' })
  feature: Feature;
}
