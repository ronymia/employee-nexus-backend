import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { User } from './user.entity';
import { Designation } from 'src/modules/designations/entities/designation.entity';
import { EmploymentStatus } from 'src/modules/employment-status/entities/employment-status.entity';
import { Department } from 'src/modules/departments/entities/department.entity';
import { WorkSchedule } from 'src/modules/work-schedules/entities/work-schedule.entity';
import { UserWorkSite } from './user-work-site.entity';

@ObjectType()
export class Employee {
  @Field(() => Int)
  userId: number;

  @Field(() => User)
  user: User;

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

  @Field(() => Designation)
  designation: Designation;

  @Field(() => Int)
  employmentStatusId: number;

  @Field(() => EmploymentStatus)
  employmentStatus: EmploymentStatus;

  @Field(() => Int)
  departmentId: number;

  @Field(() => Department)
  department: Department;

  @Field(() => Int)
  workScheduleId: number;

  @Field(() => WorkSchedule)
  workSchedule: WorkSchedule;

  @Field(() => String)
  rotaType: string;

  @Field(() => [UserWorkSite], { nullable: true })
  workSites?: UserWorkSite[] | [];

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
