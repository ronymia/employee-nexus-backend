import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsBoolean, IsOptional } from 'class-validator';

@InputType()
export class CreateEducationHistoryInput {
  @Field(() => String, { description: 'Degree or qualification' })
  @IsString()
  degree: string;

  @Field(() => String, { description: 'Field of study or major' })
  @IsString()
  fieldOfStudy: string;

  @Field(() => String, { description: 'Institution or university name' })
  @IsString()
  institution: string;

  @Field(() => String, { description: 'Country where institution is located' })
  @IsString()
  country: string;

  @Field(() => String, {
    nullable: true,
    description: 'City where institution is located',
  })
  @IsOptional()
  @IsString()
  city?: string;

  @Field(() => String, { description: 'Start date (MM-YYYY or YYYY)' })
  @IsString()
  startDate: string;

  @Field(() => String, {
    nullable: true,
    description: 'End/graduation date (MM-YYYY or YYYY)',
  })
  @IsOptional()
  @IsString()
  endDate?: string;

  @Field(() => Boolean, {
    defaultValue: false,
    description: 'Whether currently studying',
  })
  @IsBoolean()
  isCurrentlyStudying: boolean;

  @Field(() => String, {
    nullable: true,
    description: 'Grade, GPA, or percentage',
  })
  @IsOptional()
  @IsString()
  grade?: string;

  @Field(() => String, {
    nullable: true,
    description: 'Additional details or achievements',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
