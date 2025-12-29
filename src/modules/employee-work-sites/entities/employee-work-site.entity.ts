import { ObjectType, Field, Int } from '@nestjs/graphql';
import { IsDate, IsInt, IsOptional, IsBoolean } from 'class-validator';
import { BaseResponse } from 'src/common/dto/base-response.type';
import { WorkSite } from 'src/modules/work-sites/entities/work-site.entity';
import { Employee } from 'src/modules/users/entities/employee.entity';

@ObjectType()
export class EmployeeWorkSite {
  @Field(() => Int, { description: 'User ID' })
  @IsInt()
  userId: number;

  @Field(() => Employee, { description: 'Employee relation' })
  employee: Employee;

  @Field(() => Int, { description: 'Work Site ID' })
  @IsInt()
  workSiteId: number;

  @Field(() => WorkSite, { description: 'Work Site relation' })
  workSite: WorkSite;

  @Field(() => Date, { description: 'Start Date' })
  @IsDate()
  startDate: Date;

  @Field(() => Date, { nullable: true, description: 'End Date' })
  @IsDate()
  @IsOptional()
  endDate?: Date;

  @Field(() => Boolean, {
    description: 'Whether this work site assignment is currently active',
  })
  @IsBoolean()
  isActive: boolean;

  @Field(() => Date, { description: 'Created timestamp' })
  @IsDate()
  createdAt: Date;

  @Field(() => Date, { description: 'Updated timestamp' })
  @IsDate()
  updatedAt: Date;
}

@ObjectType()
export class EmployeeWorkSiteResponse extends BaseResponse(EmployeeWorkSite) {}
