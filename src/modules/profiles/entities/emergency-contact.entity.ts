import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class EmergencyContact {
  @Field(() => Int)
  profileId: number;

  @Field(() => String)
  name: string;

  @Field(() => String)
  phone: string;

  @Field(() => String)
  relation: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
