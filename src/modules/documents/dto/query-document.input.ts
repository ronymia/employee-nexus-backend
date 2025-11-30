import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { BasePaginationInput } from 'src/common/dto/base-pagination.type';

@InputType()
export class QueryDocumentInput {
  @Field(() => BasePaginationInput, { nullable: true })
  pagination?: BasePaginationInput | null;

  @Field(() => String, { nullable: true })
  @IsString()
  searchTerm?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  title?: string;
}
