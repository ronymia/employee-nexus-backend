import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsOptional, IsEnum, IsDate } from 'class-validator';
import { Gender, MaritalStatus } from 'src/modules/users/enums';

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
  @IsDate()
  dateOfBirth: Date;

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
