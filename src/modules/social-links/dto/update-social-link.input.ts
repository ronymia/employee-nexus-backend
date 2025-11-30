import { CreateSocialLinkInput } from './create-social-link.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateSocialLinkInput extends PartialType(CreateSocialLinkInput) {
  @Field(() => String)
  profileId: string;
}
