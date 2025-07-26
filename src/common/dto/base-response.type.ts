import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from '@nestjs/common';
import { PaginationMeta } from './paginated-meta.type';

export function BaseResponse<T>(TClass: Type<T>) {
  @ObjectType({ isAbstract: true })
  abstract class BaseResponseClass {
    @Field()
    statusCode: number;

    @Field()
    success: boolean;

    @Field()
    message: string;

    @Field(() => PaginationMeta)
    meta?: PaginationMeta;

    @Field(() => TClass)
    data: T;
  }

  return BaseResponseClass;
}
export function BaseQueryResponse<T>(TClass: Type<T>) {
  @ObjectType({ isAbstract: true })
  abstract class BaseQueryResponse {
    @Field()
    statusCode: number;

    @Field()
    success: boolean;

    @Field()
    message: string;

    @Field(() => PaginationMeta)
    meta?: PaginationMeta;

    @Field(() => [TClass])
    data: T[];
  }

  return BaseQueryResponse;
}
