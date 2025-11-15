// QUERY LEAVE TYPE INPUT - DEFINES FILTERING AND PAGINATION OPTIONS FOR LEAVE TYPE QUERIES
import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { IsEnum, IsString } from 'class-validator';
import { Status } from 'generated/prisma';
import { BasePaginationInput } from 'src/common/dto/base-pagination.type';
import { LeaveTypeEnum } from '../entities/leave-type.entity';

registerEnumType(Status, {
  name: 'Status',
  description: 'Status of the Leave Type',
});

registerEnumType(LeaveTypeEnum, {
  name: 'LeaveTypeEnum',
  description: 'Type of leave - PAID or UNPAID',
});

@InputType()
export class QueryLeaveTypeInput {
  @Field(() => BasePaginationInput, { nullable: true })
  pagination?: BasePaginationInput | null;

  @Field(() => String, { nullable: true })
  @IsString()
  searchTerm?: string;

  @Field(() => Status, { nullable: true })
  @IsEnum(Status)
  status?: Status;

  @Field(() => LeaveTypeEnum, { nullable: true })
  @IsEnum(LeaveTypeEnum)
  leaveType?: LeaveTypeEnum;
}
