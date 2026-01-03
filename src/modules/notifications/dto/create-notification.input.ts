import { InputType, Field, Int } from '@nestjs/graphql';
import { IsString, IsEnum, IsArray, IsOptional, IsInt } from 'class-validator';
import {
  NotificationChannel,
  NotificationPriority,
  NotificationType,
} from '../enums';

@InputType()
export class CreateNotificationInput {
  @Field(() => NotificationType)
  @IsEnum(NotificationType)
  type: NotificationType;

  @Field()
  @IsString()
  title: string;

  @Field()
  @IsString()
  message: string;

  @Field(() => NotificationPriority, { nullable: true })
  @IsEnum(NotificationPriority)
  @IsOptional()
  priority?: NotificationPriority;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  notificationTemplateId?: number;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  entityType?: string;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  entityId?: number;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  actionUrl?: string;

  @Field(() => Int)
  @IsInt()
  userId: number;

  @Field(() => [NotificationChannel])
  @IsArray()
  @IsEnum(NotificationChannel, { each: true })
  channels: NotificationChannel[];

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  businessId?: number;

  @Field({ nullable: true })
  @IsOptional()
  metadata?: string; // JSON string

  @Field({ nullable: true })
  @IsOptional()
  expiresAt?: Date;
}
