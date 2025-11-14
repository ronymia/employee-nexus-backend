import { ObjectType, Field, Int, registerEnumType, ID } from '@nestjs/graphql';
import { Status } from 'generated/prisma';
import {
  BaseQueryResponse,
  BaseResponse,
} from 'src/common/dto/base-response.type';

registerEnumType(Status, {
  name: 'Status',
  description: 'Status of the Onboarding Process',
});

@ObjectType()
export class OnboardingProcess {
  @Field(() => ID, {
    description: 'Unique identifier for the onboarding process',
  })
  id: number;
  @Field(() => String, { description: 'Name of the onboarding process' })
  name: string;

  @Field(() => String, { description: 'Description of the onboarding process' })
  description: string;

  @Field(() => Status, { description: 'Status of the onboarding process' })
  status: Status;

  @Field(() => Boolean, {
    description: 'Whether the onboarding process is required',
  })
  isRequired: boolean;

  @Field(() => Int, { description: 'ID of the business' })
  businessId: number;

  @Field(() => Int, { description: 'ID of the creator' })
  createdBy: number;

  @Field(() => Date, {
    description: 'Date when the onboarding process was created',
  })
  createdAt: Date;

  @Field(() => Date, {
    description: 'Date when the onboarding process was last updated',
  })
  updatedAt: Date;
}

@ObjectType()
export class OnboardingProcessResponse extends BaseResponse(
  OnboardingProcess,
) {}

@ObjectType()
export class OnboardingProcessesQueryResponse extends BaseQueryResponse(
  OnboardingProcess,
) {}
