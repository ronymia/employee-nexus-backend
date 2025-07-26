import { InputType, Field, Int } from '@nestjs/graphql';
import { BaseQueryInput } from 'src/common/dto/base-query.input';

@InputType()
export class ServicePlanQueryInput {
  @Field(() => BaseQueryInput, { nullable: true })
  pagination?: BaseQueryInput;

  @Field(() => Int, { nullable: true })
  price?: number;

  @Field(() => Int, { nullable: true })
  minPrice?: number;

  @Field(() => Int, { nullable: true })
  maxPrice?: number;

  @Field(() => String, { nullable: true })
  status?: string;
}
