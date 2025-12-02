import { InputType, Field, Int } from '@nestjs/graphql';
import { IsString, IsOptional } from 'class-validator';

@InputType()
export class CreateJobHistoryInput {
  @Field(() => Int, { description: 'ID of the user' })
  userId: number;

  @Field(() => String, { description: 'Job title or position' })
  @IsString()
  jobTitle: string;

  @Field(() => String, { description: 'Company or organization name' })
  @IsString()
  companyName: string;

  @Field(() => String, { description: 'Employment type' })
  @IsString()
  employmentType: string;

  @Field(() => String, { description: 'Country where job was located' })
  @IsString()
  country: string;

  @Field(() => String, {
    nullable: true,
    description: 'City where job was located',
  })
  @IsOptional()
  @IsString()
  city?: string;

  @Field(() => String, { description: 'Start date (MM-YYYY or YYYY)' })
  @IsString()
  startDate: string;

  @Field(() => String, {
    nullable: true,
    description: 'End date (MM-YYYY or YYYY)',
  })
  @IsOptional()
  @IsString()
  endDate?: string;

  @Field(() => String, {
    nullable: true,
    description: 'Job responsibilities and duties',
  })
  @IsOptional()
  @IsString()
  responsibilities?: string;

  @Field(() => String, {
    nullable: true,
    description: 'Key achievements and accomplishments',
  })
  @IsOptional()
  @IsString()
  achievements?: string;
}
