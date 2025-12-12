// QUERY DEPARTMENT INPUT - DEFINES FILTERING AND PAGINATION OPTIONS FOR DEPARTMENT QUERIES
import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsString, IsOptional } from 'class-validator';
import { BasePaginationInput } from 'src/common/dto/base-pagination.type';
import { Status } from 'src/common/enums';

@InputType()
export class QueryDepartmentInput {
  @Field(() => BasePaginationInput, { nullable: true })
  pagination?: BasePaginationInput | null;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  searchTerm?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field(() => Status, { nullable: true })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;
}
