import { InputType, Field } from '@nestjs/graphql';
import { IsEnum, IsString } from 'class-validator';
import { BasePaginationInput } from 'src/common/dto/base-pagination.type';
import { BusinessStatus } from '../enums';

@InputType()
export class QueryBusinessInput {
  @Field(() => BasePaginationInput, { nullable: true })
  pagination?: BasePaginationInput | null;

  @Field(() => String, { nullable: true })
  @IsString()
  searchTerm?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  name?: string;

  @Field(() => BusinessStatus, { nullable: true })
  @IsEnum(BusinessStatus)
  status?: BusinessStatus;
}
