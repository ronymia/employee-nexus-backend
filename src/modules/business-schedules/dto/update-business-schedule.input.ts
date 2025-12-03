import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { CreateBusinessScheduleInput } from './create-business-schedule.input';
import {
  IsInt,
  IsOptional,
  Matches,
  Min,
  Max,
  IsBoolean,
} from 'class-validator';

const TIME_RE = /^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/;

@InputType()
export class UpdateBusinessScheduleInput extends PartialType(
  CreateBusinessScheduleInput,
) {
  @Field(() => Int)
  @IsInt()
  id: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(6)
  day?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isWeekend?: boolean;

  @Field({ nullable: true, description: 'HH:MM:SS' })
  @IsOptional()
  @Matches(TIME_RE, { message: 'startTime must be HH:MM:SS' })
  startTime?: string;

  @Field({ nullable: true, description: 'HH:MM:SS' })
  @IsOptional()
  @Matches(TIME_RE, { message: 'endTime must be HH:MM:SS' })
  endTime?: string;

  // @Field(() => Int, { nullable: true })
  // @IsOptional()
  // @IsInt()
  // businessId?: number;
}
