import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { User } from 'src/modules/users/entities/user.entity';
import { AttendancePunch } from './attendance-punch.entity';
import {
  BaseQueryResponse,
  BaseResponse,
} from 'src/common/dto/base-response.type';

@ObjectType()
export class Attendance {
  @Field(() => ID, { description: 'Unique identifier for the attendance' })
  id: number;

  @Field(() => Int, { description: 'User ID' })
  userId: number;

  @Field(() => User, {
    description: 'User associated with this attendance',
    nullable: true,
  })
  user?: User;

  @Field(() => Date, { description: 'Date of attendance' })
  date: Date;

  @Field(() => Int, {
    description: 'Total work schedule minutes for the day',
  })
  scheduleMinutes: number;

  @Field(() => Int, {
    description: 'Total working minutes for the day',
  })
  totalMinutes: number;

  @Field(() => Int, {
    description: 'Total break minutes for the day',
  })
  breakMinutes: number;

  @Field(() => Int, {
    description: 'Overtime minutes beyond regular schedule',
    defaultValue: 0,
  })
  overtimeMinutes: number;

  @Field(() => String, {
    description: 'Attendance status',
    defaultValue: 'pending',
  })
  status: string;

  @Field(() => [AttendancePunch], {
    description: 'Punch records for this attendance',
    nullable: true,
  })
  punchRecords?: AttendancePunch[];

  @Field(() => Date, { description: 'Creation timestamp' })
  createdAt: Date;

  @Field(() => Date, { description: 'Last update timestamp' })
  updatedAt: Date;
}

@ObjectType()
export class AttendanceResponse extends BaseResponse(Attendance) {}

@ObjectType()
export class AttendanceQueryResponse extends BaseQueryResponse(Attendance) {}
