import { InputType, Field, Int } from '@nestjs/graphql';
import {
  IsInt,
  IsDate,
  IsOptional,
  IsBoolean,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class AssignEmployeeScheduleInput {
  @Field(() => Int, { description: 'User ID of the employee' })
  @IsInt()
  userId: number;

  @Field(() => Int, { description: 'Work Schedule ID to assign' })
  @IsInt()
  workScheduleId: number;

  @Field(() => Date, { description: 'Start date of schedule assignment' })
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @Field(() => Date, {
    nullable: true,
    description: 'End date of schedule assignment',
  })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  endDate?: Date;

  @Field(() => Boolean, {
    defaultValue: true,
    description: 'Whether this assignment is active',
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @Field(() => String, { nullable: true, description: 'Additional notes' })
  @IsString()
  @IsOptional()
  notes?: string;
}

@InputType()
export class UpdateEmployeeScheduleInput extends AssignEmployeeScheduleInput {}
