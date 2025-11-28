import { CreateWorkScheduleInput } from './create-work-schedule.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsInt } from 'class-validator';

@InputType()
export class UpdateWorkScheduleInput extends PartialType(
  CreateWorkScheduleInput,
) {
  @Field(() => Int, {
    description: 'ID of the work schedule to update',
  })
  @IsInt()
  id: number;
}
