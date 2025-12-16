import { InputType, Field, Int } from '@nestjs/graphql';
import { IsEnum, IsInt } from 'class-validator';
import { BasePaginationInput } from 'src/common/dto/base-pagination.type';
import { Status } from 'src/common/enums';

@InputType()
export class QuerySubscriptionPlanInput {
  @Field(() => BasePaginationInput, { nullable: true })
  pagination?: BasePaginationInput;

  @Field(() => Int, { nullable: true })
  @IsInt()
  price?: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  minPrice?: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  maxPrice?: number;

  @Field(() => Status, { nullable: true })
  @IsEnum(Status)
  status?: Status;
}
