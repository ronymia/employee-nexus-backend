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
export class AssignEmployeeDepartmentInput {
  @Field(() => Int, { description: 'User ID of the employee' })
  @IsInt()
  userId: number;

  @Field(() => Int, { description: 'Department ID to assign' })
  @IsInt()
  departmentId: number;

  @Field(() => Date, { description: 'Start date of department assignment' })
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @Field(() => Date, {
    nullable: true,
    description: 'End date of department assignment',
  })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  endDate?: Date;

  @Field(() => Boolean, {
    defaultValue: false,
    description: 'Whether this is the primary department',
  })
  @IsBoolean()
  @IsOptional()
  isPrimary?: boolean;

  @Field(() => Boolean, {
    defaultValue: true,
    description: 'Whether this assignment is active',
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @Field(() => String, {
    defaultValue: 'member',
    description: 'Role in department',
  })
  @IsString()
  @IsOptional()
  roleInDept?: string;

  @Field(() => String, { nullable: true, description: 'Additional remarks' })
  @IsString()
  @IsOptional()
  remarks?: string;
}
