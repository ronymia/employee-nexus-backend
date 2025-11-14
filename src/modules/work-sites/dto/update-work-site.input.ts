import { CreateWorkSiteInput } from './create-work-site.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateWorkSiteInput extends PartialType(CreateWorkSiteInput) {
  @Field(() => Int)
  id: number;
}
