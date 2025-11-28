// ATTENDANCE SETTING ENTITY - DEFINES GRAPHQL TYPES AND RESPONSE STRUCTURES FOR ATTENDANCE SETTING
import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Business } from 'src/modules/businesses/entities/business.entity';
import {
  BaseQueryResponse,
  BaseResponse,
} from 'src/common/dto/base-response.type';

@ObjectType()
export class AttendanceSetting {
  @Field(() => ID, {
    description: 'Unique identifier for the attendance setting',
  })
  id: number;

  @Field(() => Int, { description: 'ID of the business' })
  businessId: number;

  @Field(() => Business, {
    description: 'Business this attendance setting belongs to',
  })
  business: Business;

  @Field(() => Int, {
    description: 'Punch in time tolerance in minutes',
    defaultValue: 15,
  })
  punchInTimeTolerance: number;

  @Field(() => Int, {
    description: 'Work availability definition percentage',
    defaultValue: 80,
  })
  workAvailabilityDefinition: number;

  @Field(() => Boolean, {
    description: 'Whether punch in/out alerts are enabled',
    defaultValue: true,
  })
  punchInOutAlert: boolean;

  @Field(() => Int, {
    description: 'Punch in/out interval in hours',
    defaultValue: 1,
  })
  punchInOutInterval: number;

  @Field(() => Boolean, {
    description: 'Whether auto approval is enabled',
    defaultValue: false,
  })
  autoApproval: boolean;

  @Field(() => Boolean, {
    description: 'Whether geo location is enabled',
    defaultValue: false,
  })
  isGeoLocationEnabled: boolean;
}

@ObjectType()
export class AttendanceSettingResponse extends BaseResponse(
  AttendanceSetting,
) {}

@ObjectType()
export class AttendanceSettingsQueryResponse extends BaseQueryResponse(
  AttendanceSetting,
) {}
