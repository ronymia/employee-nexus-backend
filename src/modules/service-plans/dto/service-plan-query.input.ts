import { InputType, Field, Int } from '@nestjs/graphql';
import { BasePaginationInput } from 'src/common/dto/base-pagination.type';

@InputType()
export class ServicePlanQueryInput {
  @Field(() => BasePaginationInput, { nullable: true })
  pagination?: BasePaginationInput;

  @Field(() => Int, { nullable: true })
  price?: number;

  @Field(() => Int, { nullable: true })
  minPrice?: number;

  @Field(() => Int, { nullable: true })
  maxPrice?: number;

  @Field(() => String, { nullable: true })
  status?: string;
}
