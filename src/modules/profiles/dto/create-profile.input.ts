import { InputType, Field, Int } from '@nestjs/graphql';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
  IsInt,
} from 'class-validator';
import { Gender, MaritalStatus } from 'generated/prisma';
import { registerEnumType } from '@nestjs/graphql';

registerEnumType(Gender, {
  name: 'GENDER',
  description: 'Gender of the user',
});

registerEnumType(MaritalStatus, {
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
  @IsString()
  dateOfBirth: string;

  @Field(() => Gender)
  @IsEnum(Gender)
  gender: Gender;

  @Field(() => MaritalStatus)
  @IsEnum(MaritalStatus)
  maritalStatus: MaritalStatus;

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
