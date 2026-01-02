import { InputType, Field, Int } from '@nestjs/graphql';
import { IsDate, IsInt } from 'class-validator';

@InputType()
export class RenewBusinessSubscriptionInput {
  @Field(() => Int, { description: 'ID of the subscription to renew' })
  @IsInt()
  id: number;

  @Field(() => Date, { description: 'New start date' })
  @IsDate()
  startDate: Date;

  @Field(() => Date, { description: 'New end date' })
  @IsDate()
  endDate: Date;
}
