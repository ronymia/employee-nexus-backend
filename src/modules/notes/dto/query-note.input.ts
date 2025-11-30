import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsBoolean } from 'class-validator';
import { BasePaginationInput } from 'src/common/dto/base-pagination.type';

@InputType()
export class QueryNoteInput {
  @Field(() => BasePaginationInput, { nullable: true })
  pagination?: BasePaginationInput | null;

  @Field(() => String, { nullable: true })
  @IsString()
  searchTerm?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  title?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  category?: string;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  isPrivate?: boolean;
}
