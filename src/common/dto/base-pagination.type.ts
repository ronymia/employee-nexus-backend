import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class BasePaginationInput {
  @Field(() => Int, { nullable: true })
  page?: number;

  @Field(() => Int, { nullable: true })
  limit?: number;

  @Field(() => String, { nullable: true })
  sortBy?: string = 'createdAt';

  @Field(() => String, { nullable: true })
  sortOrder?: 'asc' | 'desc' = 'desc';
}
