import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class EmergencyContact {
  @Field(() => ID)
  userId: number;

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

@ObjectType()
export class EmergencyContactResponse {
  @Field(() => Boolean)
  success: boolean;

  @Field(() => Int)
  statusCode: number;

  @Field(() => String)
  message: string;

  @Field(() => EmergencyContact)
  data: EmergencyContact;
}
