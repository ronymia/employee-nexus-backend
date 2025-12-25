import { ObjectType, Field, Int } from '@nestjs/graphql';
import { BaseResponse } from 'src/common/dto/base-response.type';

@ObjectType()
export class AttendanceInsight {
  @Field(() => Int)
  pending: number;

  @Field(() => Int)
  approved: number;

  @Field(() => Int)
  absent: number;

  @Field(() => Int)
  late: number;

  @Field(() => Int)
  halfDay: number;
}

@ObjectType()
export class AttendanceSummaryResponse extends BaseResponse(
  AttendanceInsight,
) {}
