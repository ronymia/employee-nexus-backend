import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsString, IsUrl } from 'class-validator';

@InputType()
export class CreateSocialLinkInput {
  @Field(() => String, { description: 'Profile ID' })
  profileId: string;

  @Field(() => String, { description: 'Facebook profile URL', nullable: true })
  @IsString()
  @IsOptional()
  @IsUrl({}, { message: 'Facebook must be a valid URL' })
  facebook?: string;

  @Field(() => String, { description: 'Twitter profile URL', nullable: true })
  @IsString()
  @IsOptional()
  @IsUrl({}, { message: 'Twitter must be a valid URL' })
  twitter?: string;

  @Field(() => String, { description: 'LinkedIn profile URL', nullable: true })
  @IsString()
  @IsOptional()
  @IsUrl({}, { message: 'LinkedIn must be a valid URL' })
  linkedin?: string;

  @Field(() => String, { description: 'Instagram profile URL', nullable: true })
  @IsString()
  @IsOptional()
  @IsUrl({}, { message: 'Instagram must be a valid URL' })
  instagram?: string;

  @Field(() => String, { description: 'GitHub profile URL', nullable: true })
  @IsString()
  @IsOptional()
  @IsUrl({}, { message: 'GitHub must be a valid URL' })
  github?: string;
}
