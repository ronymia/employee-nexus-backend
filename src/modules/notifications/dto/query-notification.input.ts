/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { InputType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsOptional, IsBoolean, IsEnum } from 'class-validator';
import { NotificationType } from '../enums';

@InputType()
export class QueryNotificationInput {
  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  userId?: number;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  isRead?: boolean;

  @Field(() => NotificationType, { nullable: true })
  @IsEnum(NotificationType)
  @IsOptional()
  type?: NotificationType;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  businessId?: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  page?: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  limit?: number;
}
