import { ObjectType, Field, Int } from '@nestjs/graphql';
import { BaseResponse } from 'src/common/dto/base-response.type';

@ObjectType()
export class AttendanceOverview {
  @Field(() => Int, { defaultValue: 0 })
  total: number;

  @Field(() => Int, { defaultValue: 0 })
  pending: number;

  @Field(() => Int, { defaultValue: 0 })
  approved: number;

  @Field(() => Int, { defaultValue: 0 })
  rejected: number;

  @Field(() => Int, { defaultValue: 0 })
  absent: number;

  @Field(() => Int, { defaultValue: 0 })
  late: number;

  @Field(() => Int, { defaultValue: 0 })
  partial: number;
}

@ObjectType()
export class AttendanceSummaryAttendanceOverview extends BaseResponse(
  AttendanceOverview,
) {}
