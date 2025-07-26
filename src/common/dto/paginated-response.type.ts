// src/common/dto/paginated-response.type.ts
import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from '@nestjs/common';
import { PaginationMeta } from './paginated-meta.type';

export function PaginatedResponse<TItem>(TItemClass: Type<TItem>) {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedResponseClass {
    @Field(() => PaginationMeta)
    meta: PaginationMeta;

    @Field(() => [TItemClass])
    data: TItem[];
  }
  return PaginatedResponseClass;
}
