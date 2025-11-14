import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { IsEnum, IsString, IsBoolean, IsOptional } from 'class-validator';
import { Status } from 'generated/prisma';
import { BasePaginationInput } from 'src/common/dto/base-pagination.type';

registerEnumType(Status, {
  name: 'Status',
  description: 'Status of the Onboarding Process',
});

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
