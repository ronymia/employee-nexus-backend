import { Field, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { GENDER, MARITAL_STATUS } from 'generated/prisma';

registerEnumType(GENDER, {
  name: 'GENDER',
  description: 'Gender of the user',
});

registerEnumType(MARITAL_STATUS, {
  name: 'MARITAL_STATUS',
  description: 'Marital status of the user',
});

@ObjectType()
export class Profile {
  @Field(() => ID)
  id: number;

  @Field()
  fullName: string;

  @Field()
  phone: string;

  @Field(() => String, { nullable: true })
  profilePicture?: string | null;

  @Field()
  dateOfBirth: Date;

  @Field(() => GENDER)
  gender: GENDER;

  @Field(() => MARITAL_STATUS)
  maritalStatus: MARITAL_STATUS;

  @Field()
  address: string;

  @Field()
  city: string;

  @Field()
  country: string;

  @Field()
  postcode: string;

  @Field(() => Int)
  userId: number;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
