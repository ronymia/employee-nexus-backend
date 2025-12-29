import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { User } from './user.entity';
import { EmployeeDesignation } from 'src/modules/employee-designations/entities/employee-designation.entity';
import { IsOptional } from 'class-validator';
import { EmployeeDepartment } from 'src/modules/employee-departments/entities/employee-department.entity';
import { EmployeeEmploymentStatus } from 'src/modules/employee-employment-statuses/entities/employee-employment-status.entity';
import { EmployeeWorkSchedule } from 'src/modules/employee-work-schedules/entities/employee-work-schedule.entity';
import { EmployeeWorkSite } from 'src/modules/employee-work-sites/entities/employee-work-site.entity';

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

  @Field(() => [EmployeeDesignation], { nullable: true })
  @IsOptional()
  designations?: EmployeeDesignation[];

  @Field(() => [EmployeeEmploymentStatus], { nullable: true })
  employmentStatuses?: EmployeeEmploymentStatus[] | [];

  @Field(() => [EmployeeDepartment], { nullable: true })
  @IsOptional()
  departments?: EmployeeDepartment[] | [];

  @Field(() => [EmployeeWorkSchedule], { nullable: true })
  @IsOptional()
  workSchedules?: EmployeeWorkSchedule[] | [];

  @Field(() => [EmployeeWorkSite], { nullable: true })
  @IsOptional()
  workSites?: EmployeeWorkSite[] | [];

  @Field(() => String)
  rotaType: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
