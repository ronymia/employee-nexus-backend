import { InputType, Field, Int } from '@nestjs/graphql';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
  IsInt,
} from 'class-validator';
import { GENDER, MARITAL_STATUS } from 'generated/prisma';
import { registerEnumType } from '@nestjs/graphql';

registerEnumType(GENDER, {
  name: 'GENDER',
  description: 'Gender of the user',
});

registerEnumType(MARITAL_STATUS, {
  name: 'MARITAL_STATUS',
  description: 'Marital status of the user',
});

@InputType()
export class CreateProfileInput {
  @Field()
  @IsString()
  fullName: string;

  @Field()
  @IsString()
  phone: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  profilePicture?: string;

  @Field()
  @IsDateString()
  dateOfBirth: Date;

  @Field(() => GENDER)
  @IsEnum(GENDER)
  gender: GENDER;

  @Field(() => MARITAL_STATUS)
  @IsEnum(MARITAL_STATUS)
  maritalStatus: MARITAL_STATUS;

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
}
