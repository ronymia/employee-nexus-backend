import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class PaginationMeta {
  @Field(() => Int)
  page: number;

  @Field(() => Int)
  limit: number;

  @Field(() => Int)
  skip: number;

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  totalPages: number;

  @Field(() => Int)
  paginationTotal: number;
}
