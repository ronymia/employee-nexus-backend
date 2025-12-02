import { ObjectType, Field, Int, Float, ID } from '@nestjs/graphql';

@ObjectType()
export class EmploymentDetails {
  @Field(() => ID)
  id: number;

  @Field(() => Int)
  userId: number;

  @Field(() => String)
  employeeId: string;

  @Field(() => String)
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

  @Field(() => String)
  rotaType: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

@ObjectType()
export class EmploymentDetailsResponse {
  @Field(() => Boolean)
  success: boolean;

  @Field(() => Int)
  statusCode: number;

  @Field(() => String)
  message: string;

  @Field(() => EmploymentDetails)
  data: EmploymentDetails;
}
