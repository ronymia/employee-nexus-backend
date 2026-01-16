// import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
// import { User } from 'src/modules/users/entities/user.entity';
// import {
//   BaseQueryResponse,
//   BaseResponse,
// } from 'src/common/dto/base-response.type';

// @ObjectType()
// export class EducationHistory {
//   @Field(() => ID)
//   id: number;

//   @Field(() => Int, { description: 'ID of the user' })
//   userId: number;

//   @Field(() => User, {
//     nullable: true,
//     description: 'User who owns this education history',
//   })
//   user?: User;

//   @Field(() => String, { description: 'Degree or qualification' })
//   degree: string;

//   @Field(() => String, { description: 'Field of study or major' })
//   fieldOfStudy: string;

//   @Field(() => String, { description: 'Institution or university name' })
//   institution: string;

//   @Field(() => String, { description: 'Country where institution is located' })
//   country: string;

//   @Field(() => String, {
//     nullable: true,
//     description: 'City where institution is located',
//   })
//   city?: string | null;

//   @Field(() => Date, { description: 'Start date (MM-YYYY or YYYY)' })
//   startDate: Date;

//   @Field(() => Date, {
//     nullable: true,
//     description: 'End/graduation date (MM-YYYY or YYYY)',
//   })
//   endDate?: Date | null;

//   @Field(() => Boolean, { description: 'Whether currently studying' })
//   isCurrentlyStudying: boolean;

//   @Field(() => String, {
//     nullable: true,
//     description: 'Grade, GPA, or percentage',
//   })
//   grade?: string | null;

//   @Field(() => String, {
//     nullable: true,
//     description: 'Additional details or achievements',
//   })
//   description?: string | null;

//   @Field(() => Date, { description: 'Date when the record was created' })
//   createdAt: Date;

//   @Field(() => Date, { description: 'Date when the record was last updated' })
//   updatedAt: Date;
// }

// @ObjectType()
// export class EducationHistoryResponse extends BaseResponse(EducationHistory) {}

// @ObjectType()
// export class EducationHistoriesQueryResponse extends BaseQueryResponse(
//   EducationHistory,
// ) {}
