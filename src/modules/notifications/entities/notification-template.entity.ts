import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  NotificationType,
  NotificationChannel,
  NotificationPriority,
} from '../enums';
import {
  BaseResponse,
  BaseQueryResponse,
} from '../../../common/dto/base-response.type';

@ObjectType()
export class NotificationTemplate {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field(() => NotificationType)
  type: NotificationType;

  @Field()
  title: string;

  @Field()
  message: string;

  @Field(() => NotificationPriority)
  priority: NotificationPriority;

  @Field(() => [NotificationChannel])
  channels: NotificationChannel[];

  @Field()
  isActive: boolean;

  @Field(() => Int, { nullable: true })
  businessId?: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

export const NotificationTemplateResponse = BaseResponse(NotificationTemplate);
export type NotificationTemplateResponse = InstanceType<
  typeof NotificationTemplateResponse
>;

export const NotificationTemplatesQueryResponse =
  BaseQueryResponse(NotificationTemplate);
export type NotificationTemplatesQueryResponse = InstanceType<
  typeof NotificationTemplatesQueryResponse
>;
