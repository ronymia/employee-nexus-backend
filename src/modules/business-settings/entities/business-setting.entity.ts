// BUSINESS SETTING ENTITY - DEFINES GRAPHQL TYPES AND RESPONSE STRUCTURES FOR BUSINESS SETTING
import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Business } from 'src/modules/businesses/entities/business.entity';
import {
  BaseQueryResponse,
  BaseResponse,
} from 'src/common/dto/base-response.type';

@ObjectType()
export class BusinessSetting {
  @Field(() => ID, { description: 'ID of the business' })
  businessId: number;

  @Field(() => Business, { description: 'Business this setting belongs to' })
  business: Business;

  @Field(() => String, {
    description: 'Prefix for business identifiers',
  })
  identifierPrefix: string;

  @Field(() => Int, {
    description: 'Business start day of the week (0-6, where 0=Sunday)',
    defaultValue: 0,
  })
  businessStartDay: number;

  @Field(() => String, {
    description: 'Business currency code',
    defaultValue: 'BDT',
  })
  currency: string;

  @Field(() => String, {
    description: 'Business time zone',
    nullable: true,
    defaultValue: 'Asia/Dhaka',
  })
  businessTimeZone: string;

  @Field(() => String, {
    description: 'Delete read notifications setting',
  })
  deleteReadNotifications: string;

  @Field(() => String, {
    description: 'Business theme',
    nullable: true,
  })
  theme: string;
}

@ObjectType()
export class BusinessSettingResponse extends BaseResponse(BusinessSetting) {}

@ObjectType()
export class BusinessSettingsQueryResponse extends BaseQueryResponse(
  BusinessSetting,
) {}
