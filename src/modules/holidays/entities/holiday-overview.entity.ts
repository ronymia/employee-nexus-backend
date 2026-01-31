import { ObjectType, Field, Int } from '@nestjs/graphql';
import { BaseResponse } from 'src/common/dto/base-response.type';

@ObjectType()
export class HolidayOverview {
  @Field(() => Int, { defaultValue: 0 })
  total: number;

  @Field(() => Int, { defaultValue: 0 })
  public: number;

  @Field(() => Int, { defaultValue: 0 })
  religious: number;

  @Field(() => Int, { defaultValue: 0 })
  companySpecific: number;

  @Field(() => Int, { defaultValue: 0 })
  regional: number;

  @Field(() => Int, { defaultValue: 0 })
  recurring: number;

  @Field(() => Int, { defaultValue: 0 })
  paid: number;

  @Field(() => Int, { defaultValue: 0 })
  unpaid: number;
}

@ObjectType()
export class HolidayOverviewResponse extends BaseResponse(HolidayOverview) {}
