import { ObjectType, Field, Int } from '@nestjs/graphql';
import { BaseResponse } from '../../../common/dto/base-response.type';

@ObjectType()
export class NotificationPreference {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  userId: number;

  @Field()
  preferences: string; // JSON string

  @Field()
  muteAll: boolean;

  @Field({ nullable: true })
  mutedUntil?: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

export const NotificationPreferenceResponse = BaseResponse(
  NotificationPreference,
);
export type NotificationPreferenceResponse = InstanceType<
  typeof NotificationPreferenceResponse
>;
