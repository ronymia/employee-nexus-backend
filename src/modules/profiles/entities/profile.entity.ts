import { Field, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Gender, MaritalStatus } from 'generated/prisma';
import { EmergencyContact } from './emergency-contact.entity';
import { SocialLink } from 'src/modules/social-links/entities/social-link.entity';

registerEnumType(Gender, {
  name: 'GENDER',
  description: 'Gender of the user',
});

registerEnumType(MaritalStatus, {
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
  dateOfBirth: string;

  @Field(() => Gender)
  gender: Gender;

  @Field(() => MaritalStatus)
  maritalStatus: MaritalStatus;

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

@ObjectType()
export class EmergencyContactResponse {
  @Field(() => Boolean)
  success: boolean;

  @Field(() => Int)
  statusCode: number;

  @Field(() => String)
  message: string;

  @Field(() => EmergencyContact)
  data: EmergencyContact;
}
