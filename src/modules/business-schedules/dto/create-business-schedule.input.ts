import { InputType, Field, Int } from '@nestjs/graphql';
import { IsBoolean, IsInt, Min, Max, Matches } from 'class-validator';

const TIME_RE = /^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/; // HH:MM:SS

@InputType()
export class CreateBusinessScheduleInput {
  @Field(() => Int)
  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek: number;

  @Field()
  @IsBoolean()
  isWeekend: boolean;

  @Field({ description: 'HH:MM:SS' })
  @Matches(TIME_RE, { message: 'startTime must be HH:MM:SS' })
  startTime: string;

  @Field({ description: 'HH:MM:SS' })
  @Matches(TIME_RE, { message: 'endTime must be HH:MM:SS' })
  endTime: string;

  // @Field(() => Int)
  // @IsInt()
  // businessId: number;
}
