import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { EmergencyContact } from './emergency-contact.entity';
import { SocialLink } from 'src/modules/social-links/entities/social-link.entity';
import { Gender, MaritalStatus } from 'src/modules/users/enums';
import { IsEnum, IsInt } from 'class-validator';

@ObjectType()
export class Profile {
  @Field(() => ID)
  @IsInt()
  userId: number;

  @Field()
  fullName: string;

  @Field()
  phone: string;

  @Field(() => String, { nullable: true })
  profilePicture?: string | null;

  @Field()
  dateOfBirth: string;

  @Field(() => Gender)
  @IsEnum(Gender)
  gender: Gender;

  @Field(() => MaritalStatus)
  @IsEnum(MaritalStatus)
  maritalStatus: MaritalStatus;

  @Field()
  address: string;

  @Field()
  city: string;

  @Field()
  country: string;

  @Field()
  postcode: string;

  @Field(() => EmergencyContact, { nullable: true })
  emergencyContact?: EmergencyContact | null;

  @Field(() => SocialLink, { nullable: true })
  socialLinks?: SocialLink | null;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

@ObjectType()
export class ProfileResponse {
  @Field(() => Boolean)
  success: boolean;

  @Field(() => Int)
  statusCode: number;

  @Field(() => String)
  message: string;

  @Field(() => Profile)
  data: Profile;
}
