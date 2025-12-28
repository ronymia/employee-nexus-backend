// import { ObjectType, Field, Int, ID, Float } from '@nestjs/graphql';
// import { User } from 'src/modules/users/entities/user.entity';
// import { AttendancePunch } from './attendance-punch.entity';
// import {
//   BaseQueryResponse,
//   BaseResponse,
// } from 'src/common/dto/base-response.type';

// @ObjectType()
// export class Attendance {
//   @Field(() => ID, { description: 'Unique identifier for the attendance' })
//   id: number;

//   @Field(() => Int, { description: 'User ID' })
//   userId: number;

//   @Field(() => User, { description: 'User associated with this attendance' })
//   user: User;

//   @Field(() => Date, { description: 'Date of attendance' })
//   date: Date;

//   @Field(() => Float, {
//     nullable: true,
//     description: 'Total working hours for the day',
//   })
//   totalHours?: number;

//   @Field(() => Float, {
//     nullable: true,
//     description: 'Total break hours for the day',
//   })
//   breakHours?: number;

//   @Field(() => String, {
//     description: 'Attendance status',
//     defaultValue: 'present',
//   })
//   status: string;

//   @Field(() => [AttendancePunch], {
//     description: 'Punch records for this attendance',
//     nullable: true,
//   })
//   punchRecords?: AttendancePunch[];

//   @Field(() => Date, { description: 'Creation timestamp' })
//   createdAt: Date;

//   @Field(() => Date, { description: 'Last update timestamp' })
//   updatedAt: Date;
// }

// @ObjectType()
// export class AttendanceResponse extends BaseResponse(Attendance) {}

// @ObjectType()
// export class AttendanceQueryResponse extends BaseQueryResponse(Attendance) {}
