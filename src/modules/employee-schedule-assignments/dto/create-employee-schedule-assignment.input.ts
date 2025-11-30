import { InputType, Field, Int } from '@nestjs/graphql';
import {
  IsInt,
  IsDateString,
  IsBoolean,
  IsOptional,
  IsString,
} from 'class-validator';

@InputType()
export class CreateEmployeeScheduleAssignmentInput {
  @Field(() => Int, { description: 'ID of the user/employee' })
  @IsInt()
  userId: number;

  @Field(() => Int, { description: 'ID of the work schedule' })
  @IsInt()
  workScheduleId: number;

  @Field(() => String, { description: 'Assignment start date (ISO 8601)' })
  @IsDateString()
  startDate: string;

  @Field(() => String, {
    nullable: true,
    description: 'Assignment end date (ISO 8601)',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @Field(() => Boolean, {
    defaultValue: true,
    description: 'Whether this is the active schedule',
  })
  @IsBoolean()
  isActive: boolean;

  @Field(() => String, {
    nullable: true,
    description: 'Optional notes about assignment',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
