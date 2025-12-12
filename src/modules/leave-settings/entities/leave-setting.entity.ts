// LEAVE SETTING ENTITY - DEFINES GRAPHQL TYPES AND RESPONSE STRUCTURES FOR LEAVE SETTING
import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Business } from 'src/modules/businesses/entities/business.entity';
import {
  BaseQueryResponse,
  BaseResponse,
} from 'src/common/dto/base-response.type';
import { IsInt } from 'class-validator';

@ObjectType()
export class LeaveSetting {
  @Field(() => ID, { description: 'ID of the business' })
  @IsInt()
  businessId: number;

  @Field(() => Business, {
    description: 'Business this leave setting belongs to',
  })
  business: Business;

  @Field(() => Int, {
    description: 'Start month for leave cycle (0-11)',
    defaultValue: 0,
  })
  startMonth: number;

  @Field(() => Boolean, {
    description: 'Whether leave requests are auto-approved',
    defaultValue: false,
  })
  autoApproval: boolean;
}

@ObjectType()
export class LeaveSettingResponse extends BaseResponse(LeaveSetting) {}

@ObjectType()
export class LeaveSettingsQueryResponse extends BaseQueryResponse(
  LeaveSetting,
) {}
