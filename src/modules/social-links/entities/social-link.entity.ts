import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import {
  BaseQueryResponse,
  BaseResponse,
} from 'src/common/dto/base-response.type';
import { Profile } from 'src/modules/profiles/entities/profile.entity';

@ObjectType()
export class SocialLink {
  @Field(() => ID, { description: 'Profile ID (primary key)' })
  profileId: number;

  @Field(() => Profile, {
    nullable: true,
    description: 'Profile associated with these social links',
  })
  profile?: Profile;

  @Field(() => String, { description: 'Facebook profile URL', nullable: true })
  facebook: string | null;

  @Field(() => String, { description: 'Twitter profile URL', nullable: true })
  twitter: string | null;

  @Field(() => String, { description: 'LinkedIn profile URL', nullable: true })
  linkedin: string | null;

  @Field(() => String, { description: 'Instagram profile URL', nullable: true })
  instagram: string | null;

  @Field(() => String, { description: 'GitHub profile URL', nullable: true })
  github: string | null;

  @Field(() => Date, { description: 'Date when the social links were created' })
  createdAt: Date;

  @Field(() => Date, {
    description: 'Date when the social links were last updated',
  })
  updatedAt: Date;
}

@ObjectType()
export class SocialLinkResponse extends BaseResponse(SocialLink) {}

@ObjectType()
export class SocialLinksQueryResponse extends BaseQueryResponse(SocialLink) {}
