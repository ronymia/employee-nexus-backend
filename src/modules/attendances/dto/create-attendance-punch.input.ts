import { InputType, Field, Int, Float } from '@nestjs/graphql';
import {
  IsDateString,
  IsString,
  IsOptional,
  IsNumber,
  IsInt,
} from 'class-validator';

@InputType()
export class CreateAttendancePunchInput {
  @Field(() => Int, {
    nullable: true,
    description: 'Attendance ID (optional for nested creation)',
  })
  @IsOptional()
  @IsInt()
  attendanceId: number;

  @Field(() => Int, {
    nullable: true,
    description: 'Project ID if working on a project',
  })
  @IsOptional()
  @IsInt()
  projectId?: number;

  @Field(() => Int, {
    nullable: true,
    description: 'Work site ID',
  })
  @IsOptional()
  @IsInt()
  workSiteId?: number;

  @Field(() => Date, { description: 'Clock in timestamp' })
  @IsDateString()
  punchIn: Date;

  @Field(() => Date, {
    nullable: true,
    description: 'Clock out timestamp',
  })
  @IsOptional()
  @IsDateString()
  punchOut?: Date;

  @Field(() => Date, {
    nullable: true,
    description: 'Break start timestamp',
  })
  @IsOptional()
  @IsDateString()
  breakStart?: Date;

  @Field(() => Date, {
    nullable: true,
    description: 'Break end timestamp',
  })
  @IsOptional()
  @IsDateString()
  breakEnd?: Date;

  @Field(() => Float, {
    nullable: true,
    description: 'Work hours for this session',
  })
  @IsOptional()
  @IsNumber()
  workHours?: number;

  @Field(() => Float, {
    nullable: true,
    description: 'Break hours for this session',
  })
  @IsOptional()
  @IsNumber()
  breakHours?: number;

  @Field(() => String, {
    nullable: true,
    description: 'Punch in IP address',
  })
  @IsOptional()
  @IsString()
  punchInIp?: string;

  @Field(() => String, {
    nullable: true,
    description: 'Punch out IP address',
  })
  @IsOptional()
  @IsString()
  punchOutIp?: string;

  @Field(() => Float, {
    nullable: true,
    description: 'Punch in latitude',
  })
  @IsOptional()
  @IsNumber()
  punchInLat?: number;

  @Field(() => Float, {
    nullable: true,
    description: 'Punch in longitude',
  })
  @IsOptional()
  @IsNumber()
  punchInLng?: number;

  @Field(() => Float, {
    nullable: true,
    description: 'Punch out latitude',
  })
  @IsOptional()
  @IsNumber()
  punchOutLat?: number;

  @Field(() => Float, {
    nullable: true,
    description: 'Punch out longitude',
  })
  @IsOptional()
  @IsNumber()
  punchOutLng?: number;

  @Field(() => String, {
    nullable: true,
    description: 'Punch in device information',
  })
  @IsOptional()
  @IsString()
  punchInDevice?: string;

  @Field(() => String, {
    nullable: true,
    description: 'Punch out device information',
  })
  @IsOptional()
  @IsString()
  punchOutDevice?: string;

  @Field(() => String, {
    nullable: true,
    description: 'Notes for this punch session',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
