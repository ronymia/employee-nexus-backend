import { InputType, Field } from '@nestjs/graphql';
import { IsString, Matches } from 'class-validator';

@InputType()
export class CreateTimeSlotInput {
  @Field(() => String, {
    description: 'Start time in HH:mm format (e.g., 09:00)',
  })
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Start time must be in HH:mm format',
  })
  startTime: string;

  @Field(() => String, {
    description: 'End time in HH:mm format (e.g., 17:00)',
  })
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'End time must be in HH:mm format',
  })
  endTime: string;
}
