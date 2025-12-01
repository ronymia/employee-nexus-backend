import { CreateHolidayInput } from './create-holiday.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateHolidayInput extends PartialType(CreateHolidayInput) {
  @Field(() => Int)
  id: number;
}
