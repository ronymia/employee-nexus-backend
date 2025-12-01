import { ObjectType, Field, Int, ID, registerEnumType } from '@nestjs/graphql';
import { HolidayType } from 'generated/prisma';
import {
  BaseQueryResponse,
  BaseResponse,
} from 'src/common/dto/base-response.type';

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

  @Field(() => Int, { description: 'ID of the creator' })
  createdBy: number;

  @Field(() => Date, { description: 'Date when the holiday was created' })
  createdAt: Date;

  @Field(() => Date, { description: 'Date when the holiday was last updated' })
  updatedAt: Date;
}

@ObjectType()
export class HolidayResponse extends BaseResponse(Holiday) {}

@ObjectType()
export class HolidaysQueryResponse extends BaseQueryResponse(Holiday) {}
