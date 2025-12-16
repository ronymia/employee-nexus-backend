import { Field, InputType } from '@nestjs/graphql';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { BasePaginationInput } from 'src/common/dto/base-pagination.type';
import { HolidayType } from '../enums';

@InputType()
export class QueryHolidayInput {
  @Field(() => BasePaginationInput, { nullable: true })
  pagination?: BasePaginationInput | null;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  searchTerm?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  name?: string;

  @Field(() => HolidayType, { nullable: true })
  @IsEnum(HolidayType)
  @IsOptional()
  holidayType?: HolidayType;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  isRecurring?: boolean;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  isPaid?: boolean;

  @Field(() => String, {
    description: 'Filter holidays starting from this date',
    nullable: true,
  })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @Field(() => String, {
    description: 'Filter holidays ending before this date',
    nullable: true,
  })
  @IsDateString()
  @IsOptional()
  endDate?: string;
}
