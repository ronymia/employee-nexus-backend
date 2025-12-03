import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  BaseQueryResponse,
  BaseResponse,
} from 'src/common/dto/base-response.type';

@ObjectType()
export class BusinessSchedule {
  @Field(() => Int)
  id: number;

  /** 0–6; define your own convention (e.g., 0=Sun) */
  @Field(() => Int)
  day: number;

  @Field()
  isWeekend: boolean;

  /** HH:MM:SS (seconds precision to match @db.Time(0)) */
  @Field()
  startTime: string;

  /** HH:MM:SS */
  @Field()
  endTime: string;

  @Field(() => Int)
  businessId: number;
}
@ObjectType()
export class BusinessScheduleResponse extends BaseResponse(BusinessSchedule) {}

@ObjectType()
export class BusinessScheduleQueryResponse extends BaseQueryResponse(
  BusinessSchedule,
) {}
