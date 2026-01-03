import { InputType, Field, Float, Int } from '@nestjs/graphql';
import {
  IsDateString,
  IsString,
  IsOptional,
  IsNumber,
  IsInt,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class CreateAttendanceInput {
  @Field(() => Int, { description: 'User ID' })
  @IsInt()
  userId: number;

  @Field(() => Date, { description: 'Date of attendance' })
  @IsDateString()
  date: Date;

  @Field(() => Int, {
    nullable: true,
    description: 'Total break minutes for the day',
  })
  @IsOptional()
  @IsNumber()
  breakMinutes?: number;

  @Field(() => [CreateAttendancePunchInput], {
    description: 'Punch records for this attendance',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAttendancePunchInput)
  punchRecords: CreateAttendancePunchInput[];
}

@InputType()
export class CreateAttendancePunchInput {
  @Field(() => Int, {
    description: 'Project ID if working on a project',
  })
  @IsInt()
  projectId: number;

  @Field(() => Int, {
    description: 'Work site ID',
  })
  @IsInt()
  workSiteId: number;

  @Field(() => Date, { description: 'Clock in timestamp' })
  @IsDateString()
  punchIn: Date;

  @Field(() => Date, {
    description: 'Clock out timestamp',
  })
  @IsDateString()
  punchOut: Date;

  @Field(() => Float, {
    nullable: true,
    description: 'Break minutes for this session',
  })
  @IsOptional()
  @IsNumber()
  breakMinutes?: number;

  @Field(() => String, {
    nullable: true,
    description: 'Notes for this punch session',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  // PUNCH IN FIELDS
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  punchInIp?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  punchInLat?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  punchInLng?: number;

  @Field(() => String, { description: 'Device used for punch in' })
  @IsString()
  punchInDevice: string;

  // PUNCH OUT FIELDS
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  punchOutIp?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  punchOutLat?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  punchOutLng?: number;

  @Field(() => String, { description: 'Device used for punch out' })
  @IsString()
  punchOutDevice: string;
}
