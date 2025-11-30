import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { User } from 'src/modules/users/entities/user.entity';
import {
  BaseQueryResponse,
  BaseResponse,
} from 'src/common/dto/base-response.type';

@ObjectType()
export class JobHistory {
  @Field(() => ID)
  id: number;

  @Field(() => Int, { description: 'ID of the user' })
  userId: number;

  @Field(() => User, {
    nullable: true,
    description: 'User who owns this job history',
  })
  user?: User;

  @Field(() => String, { description: 'Job title or position' })
  jobTitle: string;

  @Field(() => String, { description: 'Company or organization name' })
  companyName: string;

  @Field(() => String, { description: 'Employment type' })
  employmentType: string;

  @Field(() => String, { description: 'Country where job was located' })
  country: string;

  @Field(() => String, {
    nullable: true,
    description: 'City where job was located',
  })
  city?: string | null;

  @Field(() => String, { description: 'Start date (MM-YYYY or YYYY)' })
  startDate: string;

  @Field(() => String, {
    nullable: true,
    description: 'End date (MM-YYYY or YYYY)',
  })
  endDate?: string | null;

  @Field(() => String, {
    nullable: true,
    description: 'Job responsibilities and duties',
  })
  responsibilities?: string | null;

  @Field(() => String, {
    nullable: true,
    description: 'Key achievements and accomplishments',
  })
  achievements?: string | null;

  @Field(() => Date, { description: 'Date when the record was created' })
  createdAt: Date;

  @Field(() => Date, { description: 'Date when the record was last updated' })
  updatedAt: Date;
}

@ObjectType()
export class JobHistoryResponse extends BaseResponse(JobHistory) {}

@ObjectType()
export class JobHistoriesQueryResponse extends BaseQueryResponse(JobHistory) {}
