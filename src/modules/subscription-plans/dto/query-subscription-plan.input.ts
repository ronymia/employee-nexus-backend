import { InputType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { IsEnum, IsInt } from 'class-validator';
import { Status } from 'generated/prisma';
import { BasePaginationInput } from 'src/common/dto/base-pagination.type';

registerEnumType(Status, {
  name: 'Status',
  description: 'Status of the service plan',
});

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
