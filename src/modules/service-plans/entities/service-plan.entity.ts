import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { User } from 'src/modules/users/entities/user.entity';

@ObjectType()
export class ServicePlan {
  @Field(() => ID, { description: 'Unique identifier for the service plan' })
  id: number;

  @Field({ description: 'Name of the service plan' })
  name: string;

  @Field({ description: 'Description of the service plan' })
  description: string;

  @Field(() => Int, { description: 'One-time setup fee for the service plan' })
  setupFee: number;

  @Field(() => String, {
    description: 'Status of the service plan',
    defaultValue: 'ACTIVE',
  })
  status: string;

  @Field(() => Int, { description: 'Price of the service plan' })
  price: number;

  // @Field(() => [Business], {
  //   description: 'Businesses using this service plan',
  // })
  // businesses: Business[];

  @Field(() => Int, { description: 'User who created the service plan' })
  createdBy: number;

  @Field(() => User, {
    nullable: true,
    description: 'Creator of the service plan',
  })
  creator?: User | null;

  @Field(() => Date, {
    description: 'Timestamp when the service plan was created',
  })
  createdAt: Date;

  @Field(() => Date, {
    description: 'Timestamp when the service plan was last updated',
  })
  updatedAt: Date;
}
