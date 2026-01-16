import { ObjectType, Field, Int, Float, ID } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { BaseResponse } from 'src/common/dto/base-response.type';
import { EmployeeDepartment } from 'src/modules/employee-departments/entities/employee-department.entity';
import { EmployeeDesignation } from 'src/modules/employee-designations/entities/employee-designation.entity';
import { EmployeeEmploymentStatus } from 'src/modules/employee-employment-statuses/entities/employee-employment-status.entity';
import { EmployeeWorkSchedule } from 'src/modules/employee-work-schedules/entities/employee-work-schedule.entity';
import { EmployeeWorkSite } from 'src/modules/employee-work-sites/entities/employee-work-site.entity';

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

@ObjectType()
export class EmploymentDetailsResponse extends BaseResponse(
  EmploymentDetails,
) {}
