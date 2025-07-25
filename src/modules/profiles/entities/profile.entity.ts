import { Field, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { GENDER } from 'generated/prisma';

registerEnumType(GENDER, {
  name: 'GENDER',
  description: 'Gender of the user',
});

@ObjectType()
export class Profile {
  @Field(() => ID)
  id: number;

  @Field()
  full_name: string;

  @Field()
  phone: string;

  @Field(() => String, { nullable: true })
  profilePicture?: string | null;

  @Field()
  dateOfBirth: Date;

  @Field(() => GENDER)
  gender: GENDER;

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
