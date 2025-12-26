import { ObjectType, Field, Int, Float, ID } from '@nestjs/graphql';
import { UserWorkSite } from 'src/modules/users/entities/user-work-site.entity';

@ObjectType()
export class EmploymentDetails {
  @Field(() => ID)
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

  @Field(() => [UserWorkSite], { nullable: true })
  workSites?: UserWorkSite[] | [];

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
