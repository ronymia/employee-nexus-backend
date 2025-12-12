/* eslint-disable @typescript-eslint/no-unsafe-return */
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
export class Notification {
  @Field(() => Int)
  id: number;

  @Field(() => NotificationType)
  type: NotificationType;

  @Field()
  title: string;

  @Field()
  message: string;

  @Field(() => NotificationPriority)
  priority: NotificationPriority;

  @Field(() => Int, { nullable: true })
  notificationTemplateId?: number;

  @Field({ nullable: true })
  entityType?: string;

  @Field(() => Int, { nullable: true })
  entityId?: number;

  @Field({ nullable: true })
  actionUrl?: string;

  @Field(() => Int)
  userId: number;

  @Field()
  isRead: boolean;

  @Field({ nullable: true })
  readAt?: Date;

  @Field(() => [NotificationChannel])
  channels: NotificationChannel[];

  @Field(() => [NotificationChannel])
  sentVia: NotificationChannel[];

  @Field(() => Int, { nullable: true })
  businessId?: number;

  @Field({ nullable: true })
  metadata?: string; // JSON string

  @Field({ nullable: true })
  expiresAt?: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class NotificationResponse extends BaseResponse(Notification) {}

@ObjectType()
export class NotificationsQueryResponse extends BaseQueryResponse(
  Notification,
) {}
