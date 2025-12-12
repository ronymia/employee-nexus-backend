import { ObjectType, Field, Int, ID, registerEnumType } from '@nestjs/graphql';
import {
  BaseQueryResponse,
  BaseResponse,
} from 'src/common/dto/base-response.type';
import { Business } from 'src/modules/businesses/entities/business.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { HolidayType } from '../enums';

registerEnumType(HolidayType, {
  name: 'HolidayType',
  description: 'Type of holiday',
});

@ObjectType()
export class Holiday {
  @Field(() => ID, { description: 'Unique identifier for the holiday' })
  id: number;

  @Field(() => String, { description: 'Name of the holiday' })
  name: string;

  @Field(() => String, {
    description: 'Description of the holiday',
    nullable: true,
  })
  description?: string;

  @Field(() => Date, { description: 'Holiday start date' })
  startDate: Date;

  @Field(() => Date, { description: 'Holiday end date' })
  endDate: Date;

  @Field(() => Boolean, { description: 'Is this a recurring annual holiday' })
  isRecurring: boolean;

  @Field(() => Boolean, { description: 'Is this a paid holiday' })
  isPaid: boolean;

  @Field(() => HolidayType, { description: 'Type of holiday' })
  holidayType: HolidayType;

  @Field(() => Int, { description: 'ID of the business' })
  businessId: number;

  @Field(() => Business, {
    description: 'Business associated with the holiday',
  })
  business: Business;

  @Field(() => Int, { description: 'ID of the creator' })
  createdBy: number;

  @Field(() => User, { description: 'ID of the updater' })
  creator: User;

  @Field(() => Date, { description: 'Date when the holiday was created' })
  createdAt: Date;

  @Field(() => Date, { description: 'Date when the holiday was last updated' })
  updatedAt: Date;
}

@ObjectType()
export class HolidayResponse extends BaseResponse(Holiday) {}

@ObjectType()
export class HolidaysQueryResponse extends BaseQueryResponse(Holiday) {}
