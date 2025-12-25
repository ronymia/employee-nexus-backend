import { InputType, Field, Int, Float } from '@nestjs/graphql';
import {
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

@InputType()
export class UpdateEmploymentDetailsInput {
  @Field(() => Int, { description: 'User ID' })
  @IsInt()
  userId: number;

  @Field(() => String, { description: 'Employee ID' })
  @IsString()
  employeeId: string;

  @Field(() => String, {
    description: 'National ID Number',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  nidNumber?: string;

  @Field(() => String, {
    description: 'Joining date',
    nullable: true,
  })
  @IsDateString()
  @IsOptional()
  joiningDate?: string;

  @Field(() => Float, {
    description: 'Salary per month',
    nullable: true,
  })
  @IsNumber()
  @IsOptional()
  salaryPerMonth?: number;

  @Field(() => Int, {
    description: 'Working days per week',
    nullable: true,
  })
  @IsInt()
  @IsOptional()
  workingDaysPerWeek?: number;

  @Field(() => Int, {
    description: 'Working hours per week',
    nullable: true,
  })
  @IsInt()
  @IsOptional()
  workingHoursPerWeek?: number;

  @Field(() => Int, {
    description: 'Designation ID',
    nullable: true,
  })
  @IsInt()
  @IsOptional()
  designationId?: number;

  @Field(() => Int, {
    description: 'Employment Status ID',
    nullable: true,
  })
  @IsInt()
  @IsOptional()
  employmentStatusId?: number;

  @Field(() => Int, {
    description: 'Department ID',
    nullable: true,
  })
  @IsInt()
  @IsOptional()
  departmentId?: number;

  // @Field(() => Int, {
  //   description: 'Work Site ID',
  //   nullable: true,
  // })
  // @IsInt()
  // @IsOptional()
  // workSiteId?: number;

  @Field(() => Int, {
    description: 'Work Schedule ID',
    nullable: true,
  })
  @IsInt()
  @IsOptional()
  workScheduleId?: number;

  @Field(() => String, {
    description: 'Rota type',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  rotaType?: string;
}
