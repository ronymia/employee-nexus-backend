import { InputType, Field, Float } from '@nestjs/graphql';
import { IsDateString, IsString, IsOptional, IsNumber } from 'class-validator';

@InputType()
export class CreateAttendanceInput {
  @Field(() => Date, { description: 'Date of attendance' })
  @IsDateString()
  date: Date;

  @Field(() => Float, {
    nullable: true,
    description: 'Total working hours for the day',
  })
  @IsOptional()
  @IsNumber()
  totalHours?: number;

  @Field(() => Float, {
    nullable: true,
    description: 'Total break hours for the day',
  })
  @IsOptional()
  @IsNumber()
  breakHours?: number;

  @Field(() => String, {
    description: 'Attendance status',
    defaultValue: 'present',
  })
  @IsString()
  status: string;
}
