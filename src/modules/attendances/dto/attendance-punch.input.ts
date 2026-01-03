import { InputType, Field, Int, Float } from '@nestjs/graphql';
import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

@InputType()
export class PunchInInput {
  @Field(() => Int, { description: 'Project ID' })
  @IsInt()
  projectId: number;

  @Field(() => Int, { description: 'Work Site ID' })
  @IsInt()
  workSiteId: number;

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

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  notes?: string;
}

@InputType()
export class PunchOutInput {
  @Field(() => Int)
  @IsInt()
  punchId: number;

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

  // @Field(() => Float, { nullable: true })
  // @IsOptional()
  // @IsNumber()
  // breakMinutes?: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  notes?: string;
}
