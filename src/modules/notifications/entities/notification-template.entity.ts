/* eslint-disable @typescript-eslint/no-unsafe-return */
import { ObjectType, Field, Int } from '@nestjs/graphql';
// import {
//   NotificationType,
//   NotificationChannel,
//   NotificationPriority,
// } from '../enums';
import {
  BaseResponse,
  BaseQueryResponse,
} from '../../../common/dto/base-response.type';
import {
  NotificationChannel,
  NotificationPriority,
  NotificationType,
} from 'generated/prisma';

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

@ObjectType()
export class NotificationTemplateResponse extends BaseResponse(
  NotificationTemplate,
) {}

@ObjectType()
export class NotificationTemplatesQueryResponse extends BaseQueryResponse(
  NotificationTemplate,
) {}
