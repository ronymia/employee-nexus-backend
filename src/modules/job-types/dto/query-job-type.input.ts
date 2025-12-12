import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { IsEnum, IsString } from 'class-validator';
import { BasePaginationInput } from 'src/common/dto/base-pagination.type';
import { Status } from 'src/common/enums';

registerEnumType(Status, {
  name: 'Status',
  description: 'Status of the Job Type',
});

@InputType()
export class QueryJobTypeInput {
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
}
