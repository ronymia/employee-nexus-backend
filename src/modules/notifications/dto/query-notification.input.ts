/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { InputType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { IsInt, IsOptional, IsBoolean, IsEnum } from 'class-validator';
import { NotificationType } from 'generated/prisma';
// import { NotificationType } from '../enums';

// registerEnumType(NotificationChannel, {
//   name: 'NotificationChannel',
// });

registerEnumType(NotificationType, {
  name: 'NotificationType',
});

// registerEnumType(NotificationPriority, {
//   name: 'NotificationPriority',
// });

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
