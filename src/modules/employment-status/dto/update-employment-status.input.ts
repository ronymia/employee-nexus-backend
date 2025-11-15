// UPDATE EMPLOYMENT STATUS INPUT - DEFINES THE STRUCTURE FOR UPDATING EXISTING EMPLOYMENT STATUS RECORDS
import { CreateEmploymentStatusInput } from './create-employment-status.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateEmploymentStatusInput extends PartialType(
  CreateEmploymentStatusInput,
) {
  @Field(() => Int)
  id: number;
}
