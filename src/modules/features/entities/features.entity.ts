import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Feature {
  @Field(() => ID, { description: 'ID of the module' })
  id: number;

  @Field(() => String, { description: 'Name of the module' })
  name: string;
}

@ObjectType()
export class FeatureResponse {
  @Field()
  statusCode: number;

  @Field()
  success: boolean;

  @Field()
  message: string;

  @Field(() => Feature)
  data: Feature;
}

@ObjectType()
export class FeatureQueryResponse {
  @Field()
  statusCode: number;

  @Field()
  success: boolean;

  @Field()
  message: string;

  @Field(() => [Feature])
  data: Feature[];
}
