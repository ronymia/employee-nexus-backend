import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsString, IsBoolean, IsOptional } from 'class-validator';
import { BasePaginationInput } from 'src/common/dto/base-pagination.type';
import { Status } from 'src/common/enums';

@InputType()
export class QueryOnboardingProcessInput {
  @Field(() => BasePaginationInput, { nullable: true })
  pagination?: BasePaginationInput | null;

  @Field(() => String, { nullable: true })
  @IsString()
  searchTerm?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  name?: string;

  @Field(() => Status, { nullable: true })
  @IsEnum(Status)
  status?: Status;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  isRequired?: boolean;
}
