import { InputType, Field, Float, Int } from '@nestjs/graphql';
import { CreateUserInput } from './create-user.input';
import { CreateProfileInput } from 'src/modules/profiles/dto/create-profile.input';
import {
  IsString,
  IsEnum,
  IsNumber,
  Min,
  IsDateString,
  IsOptional,
} from 'class-validator';
import { SalaryType } from 'src/modules/employee-salaries/entities/employee-salary.entity';

@InputType()
export class CreateEmergencyContactInput {
  @Field()
  @IsString()
  name: string;

  @Field()
  @IsString()
  phone: string;

  @Field()
  @IsString()
  relation: string;
}

@InputType()
export class CreateEmployeeInput {
  @Field(() => CreateUserInput)
  user: CreateUserInput;

  @Field(() => CreateProfileInput)
  profile: CreateProfileInput;

  @Field(() => CreateEmergencyContactInput, { nullable: true })
  emergencyContact?: CreateEmergencyContactInput;

  @Field(() => String, { nullable: true })
  @IsString()
  employeeId?: string;

  @Field(() => String)
  @IsString()
  nidNumber: string;

  @Field(() => Date)
  joiningDate: Date;

  @Field(() => Float, { description: 'Salary amount' })
  @IsNumber()
  @Min(0)
  salaryAmount: number;

  @Field(() => SalaryType, {
    description: 'Type of salary (HOURLY, DAILY, MONTHLY)',
  })
  @IsEnum(SalaryType)
  salaryType: SalaryType;

  @Field(() => String, {
    nullable: true,
    description:
      'Start date of the salary (YYYY-MM-DD). Defaults to joiningDate if not provided',
  })
  @IsOptional()
  @IsDateString()
  salaryStartDate?: string;

  @Field(() => String, {
    nullable: true,
    description: 'Reason for initial salary',
  })
  @IsOptional()
  salaryReason?: string;

  @Field(() => String, {
    nullable: true,
    description: 'Remarks for initial salary',
  })
  @IsOptional()
  salaryRemarks?: string;

  @Field(() => Int)
  designationId: number;

  @Field(() => Int)
  employmentStatusId: number;

  @Field(() => Int)
  departmentId: number;

  @Field(() => [Int], { nullable: true })
  workSiteIds?: number[];

  @Field(() => Int)
  workScheduleId: number;
}
