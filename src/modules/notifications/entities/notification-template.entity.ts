import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  BaseResponse,
  BaseQueryResponse,
} from '../../../common/dto/base-response.type';
import { NotificationPriority, NotificationType } from '../enums';

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
