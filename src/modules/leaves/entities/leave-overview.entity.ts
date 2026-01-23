import { ObjectType, Field, Int } from '@nestjs/graphql';
import { BaseResponse } from 'src/common/dto/base-response.type';

@ObjectType()
export class LeaveOverview {
  @Field(() => Int, { defaultValue: 0 })
  total: number;

  @Field(() => Int, { defaultValue: 0 })
  pending: number;

  @Field(() => Int, { defaultValue: 0 })
  approved: number;

  @Field(() => Int, { defaultValue: 0 })
  rejected: number;

  @Field(() => Int, { defaultValue: 0 })
  cancelled: number;

  @Field(() => Int, { defaultValue: 0 })
  singleDay: number;

  @Field(() => Int, { defaultValue: 0 })
  multiDay: number;

  @Field(() => Int, { defaultValue: 0 })
  halfDay: number;
}

@ObjectType()
export class LeaveOverviewResponse extends BaseResponse(LeaveOverview) {}
