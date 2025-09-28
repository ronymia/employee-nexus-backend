import { InputType, Field, registerEnumType } from '@nestjs/graphql';
import { IsEnum, IsString } from 'class-validator';
import { BusinessStatus } from 'generated/prisma';
import { BasePaginationInput } from 'src/common/dto/base-pagination.type';

registerEnumType(BusinessStatus, {
  name: 'BusinessStatus',
  description: 'Business Status of Business',
});

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
