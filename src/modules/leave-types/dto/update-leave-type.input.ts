// UPDATE LEAVE TYPE INPUT - DEFINES THE STRUCTURE FOR UPDATING EXISTING LEAVE TYPE RECORDS
import { CreateLeaveTypeInput } from './create-leave-type.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateLeaveTypeInput extends PartialType(CreateLeaveTypeInput) {
  @Field(() => Int)
  id: number;
}
