import { Field, InputType, Int } from '@nestjs/graphql';
import { IsOptional, IsString, IsDateString, IsInt } from 'class-validator';
import { BasePaginationInput } from 'src/common/dto/base-pagination.type';

@InputType()
export class QueryAttendanceInput {
  @Field(() => BasePaginationInput, { nullable: true })
  pagination?: BasePaginationInput | null;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  status?: string;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @Field(() => Int, { nullable: true, description: 'User ID' })
  @IsInt()
  @IsOptional()
  userId?: number;
}
