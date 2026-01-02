import { InputType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { BasePaginationInput } from 'src/common/dto/base-pagination.type';

@InputType()
export class QueryBusinessSubscriptionInput {
  @Field(() => BasePaginationInput, { nullable: true })
  pagination?: BasePaginationInput | null;

  @Field(() => Int, {
    description: 'ID of the business to query subscriptions for',
    nullable: true,
  })
  @IsOptional()
  @IsInt()
  businessId?: number;

  @Field(() => String, {
    description: 'Status filter',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  status?: string;

  @Field(() => String, {
    description: 'Search term',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  searchTerm?: string;
}
