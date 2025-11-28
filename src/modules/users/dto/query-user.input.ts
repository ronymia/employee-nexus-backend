import { InputType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { BasePaginationInput } from 'src/common/dto/base-pagination.type';

@InputType()
export class QueryUserInput {
  @Field(() => BasePaginationInput, { nullable: true })
  pagination?: BasePaginationInput | null;

  @Field(() => String, { nullable: true })
  @IsString()
  searchTerm?: string;
}
