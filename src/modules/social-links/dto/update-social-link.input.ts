import { CreateSocialLinkInput } from './create-social-link.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateSocialLinkInput extends PartialType(CreateSocialLinkInput) {}
