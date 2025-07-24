import { Field, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { IsDate, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { GENDER } from 'generated/prisma';

registerEnumType(GENDER, {
  name: 'GENDER',
  description: 'Gender of the user',
});

@ObjectType()
export class Profile {
  @Field(() => ID)
  @IsInt()
  id: number;

  @Field()
  full_name: string;

  @Field()
  @IsString()
  phone: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  profilePicture?: string;

  @Field()
  @IsDate()
  dateOfBirth: Date;

  @Field(() => GENDER)
  @IsEnum(GENDER)
  gender: GENDER;

  @Field()
  @IsString()
  address: string;

  @Field()
  @IsString()
  city: string;

  @Field()
  @IsString()
  country: string;

  @Field()
  @IsString()
  postcode: string;

  @Field(() => Int)
  @IsInt()
  userId: number;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
