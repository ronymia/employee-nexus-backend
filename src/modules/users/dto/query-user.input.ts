import { InputType, Field } from '@nestjs/graphql';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { BasePaginationInput } from 'src/common/dto/base-pagination.type';

@InputType()
export class QueryUserInput {
  @Field(() => BasePaginationInput, { nullable: true })
  pagination?: BasePaginationInput | null;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  searchTerm?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  role?: string | null;

  @Field(() => String, { nullable: true })
  @IsOptional()
  status?: string | null;

  @Field(() => Number, { nullable: true })
  @IsInt()
  @IsOptional()
  departmentId?: number | null;

  @Field(() => Number, { nullable: true })
  @IsInt()
  @IsOptional()
  employmentStatusId?: number | null;

  @Field(() => Number, { nullable: true })
  @IsInt()
  @IsOptional()
  designationId?: number | null;

  @Field(() => Number, { nullable: true })
  @IsInt()
  @IsOptional()
  projectId?: number | null;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  isProjectAssociated?: boolean | null;

  // @Field(() => Number, { nullable: true })
  // @IsInt()
  // @IsOptional()
  // workSiteId?: number | null;
}
