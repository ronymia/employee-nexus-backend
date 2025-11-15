// QUERY DEPARTMENT INPUT - DEFINES FILTERING AND PAGINATION OPTIONS FOR DEPARTMENT QUERIES
import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { IsEnum, IsString, IsOptional } from 'class-validator';
import { Status } from 'generated/prisma';
import { BasePaginationInput } from 'src/common/dto/base-pagination.type';

registerEnumType(Status, {
  name: 'Status',
  description: 'Status of the Department',
});

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
