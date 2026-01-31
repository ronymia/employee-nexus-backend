import { InputType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsDate, IsOptional, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class AssignEmployeeWorkSiteInput {
  @Field(() => Int, { description: 'User ID of the employee' })
  @IsInt()
  userId: number;

  @Field(() => Int, { description: 'Work Site ID to assign' })
  @IsInt()
  workSiteId: number;

  @Field(() => Date, { description: 'Start date of work site assignment' })
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @Field(() => Date, {
    nullable: true,
    description: 'End date of work site assignment',
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
}

@InputType()
export class UpdateEmployeeWorkSiteInput extends AssignEmployeeWorkSiteInput {}
