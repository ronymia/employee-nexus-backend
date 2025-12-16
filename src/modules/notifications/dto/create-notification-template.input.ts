/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { InputType, Field, Int } from '@nestjs/graphql';
import {
  IsString,
  IsEnum,
  IsArray,
  IsOptional,
  IsInt,
  IsBoolean,
} from 'class-validator';
import {
  NotificationChannel,
  NotificationPriority,
  NotificationType,
} from '../enums';

@InputType()
export class CreateNotificationTemplateInput {
  @Field()
  @IsString()
  name: string;

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

  @Field(() => [NotificationChannel])
  @IsArray()
  @IsEnum(NotificationChannel, { each: true })
  channels: NotificationChannel[];

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @Field(() => Int)
  @IsInt()
  businessId: number;
}
