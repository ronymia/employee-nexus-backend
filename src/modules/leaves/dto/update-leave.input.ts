import { CreateLeaveInput } from './create-leave.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateLeaveInput extends PartialType(CreateLeaveInput) {
  @Field(() => Int)
  id: number;
}
