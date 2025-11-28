import { InputType, Field, Float, Int } from '@nestjs/graphql';
import { CreateUserInput } from './create-user.input';
import { CreateProfileInput } from 'src/modules/profiles/dto/create-profile.input';
import { IsString } from 'class-validator';

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

  @Field(() => Float)
  salaryPerMonth: number;

  @Field(() => Int, { nullable: true })
  workingDaysPerWeek?: number;

  @Field(() => Int, { nullable: true })
  workingHoursPerWeek?: number;

  @Field(() => Int)
  designationId: number;

  @Field(() => Int)
  employmentStatusId: number;

  @Field(() => Int)
  departmentId: number;

  @Field(() => Int)
  workSiteId: number;

  @Field(() => Int)
  workScheduleId: number;

  @Field(() => String, { nullable: true })
  rotaType?: string;
}
