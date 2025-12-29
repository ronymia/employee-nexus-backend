import { CreateWorkScheduleInput } from './create-work-schedule.input';
import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import { IsInt } from 'class-validator';

@InputType()
export class UpdateWorkScheduleInput extends PartialType(
  CreateWorkScheduleInput,
) {
  @Field(() => ID, {
    description: 'ID of the work schedule to update',
  })
  @IsInt()
  id: number;
}
