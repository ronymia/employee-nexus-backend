import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsBoolean } from 'class-validator';

@InputType()
export class UpdateNotificationPreferenceInput {
  @Field({ nullable: true })
  @IsOptional()
  preferences?: string; // JSON string

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  muteAll?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  mutedUntil?: Date;
}
