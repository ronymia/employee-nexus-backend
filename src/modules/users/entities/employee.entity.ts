import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from './user.entity';
import { EmployeeDesignation } from 'src/modules/employee-designations/entities/employee-designation.entity';
import { IsOptional } from 'class-validator';
import { EmployeeDepartment } from 'src/modules/employee-departments/entities/employee-department.entity';
import { EmployeeEmploymentStatus } from 'src/modules/employee-employment-statuses/entities/employee-employment-status.entity';
import { EmployeeWorkSchedule } from 'src/modules/employee-work-schedules/entities/employee-work-schedule.entity';
// import { EmployeeWorkSite } from 'src/modules/employee-work-sites/entities/employee-work-site.entity';
import { Department } from 'src/modules/departments/entities/department.entity';
import { Designation } from 'src/modules/designations/entities/designation.entity';
import { EmploymentStatus } from 'src/modules/employment-status/entities/employment-status.entity';
import { WorkSite } from 'src/modules/work-sites/entities/work-site.entity';
import { WorkSchedule } from 'src/modules/work-schedules/entities/work-schedule.entity';
import { EmployeeSalary } from 'src/modules/employee-salaries/entities/employee-salary.entity';

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

  @Field(() => [EmployeeSalary], { nullable: true })
  salaries: EmployeeSalary[] | [];

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

  // @Field(() => [EmployeeWorkSite], { nullable: true })
  // @IsOptional()
  // workSites?: EmployeeWorkSite[] | [];

  @Field(() => Department, {
    nullable: true,
    description: 'Active department of the user',
  })
  department?: Department | null;

  @Field(() => Designation, {
    nullable: true,
    description: 'Active designation of the user',
  })
  designation?: Designation | null;

  @Field(() => EmploymentStatus, {
    nullable: true,
    description: 'Active employment status of the user',
  })
  employmentStatus?: EmploymentStatus | null;

  @Field(() => [WorkSite], {
    nullable: true,
    description: 'Active work sites of the user',
  })
  workSites?: WorkSite[] | [];

  @Field(() => WorkSchedule, {
    nullable: true,
    description: 'Active work schedule of the user',
  })
  workSchedule?: WorkSchedule | null;

  @Field(() => EmployeeSalary, {
    nullable: true,
    description: 'Active salary of the employee',
  })
  salary?: EmployeeSalary | null;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
