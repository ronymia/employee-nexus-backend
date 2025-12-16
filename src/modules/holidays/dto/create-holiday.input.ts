import { InputType, Field } from '@nestjs/graphql';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { HolidayType } from '../enums';

@InputType()
export class CreateHolidayInput {
  @Field(() => String, { description: 'Name of the holiday' })
  @IsString()
  name: string;

  @Field(() => String, {
    description: 'Description of the holiday',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @Field(() => String, { description: 'Holiday start date' })
  @IsDateString()
  startDate: string;

  @Field(() => String, { description: 'Holiday end date' })
  @IsDateString()
  endDate: string;

  @Field(() => Boolean, {
    description: 'Is this a recurring annual holiday',
    defaultValue: false,
  })
  @IsBoolean()
  isRecurring: boolean;

  @Field(() => Boolean, {
    description: 'Is this a paid holiday',
    defaultValue: true,
  })
  @IsBoolean()
  isPaid: boolean;

  @Field(() => HolidayType, { description: 'Type of holiday' })
  @IsEnum(HolidayType)
  holidayType: HolidayType;
}
