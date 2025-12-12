import { InputType, Field } from '@nestjs/graphql';
import { IsEnum, IsString } from 'class-validator';
import { BasePaginationInput } from 'src/common/dto/base-pagination.type';
import { Status } from 'src/common/enums';

@InputType()
export class QueryDesignationInput {
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
