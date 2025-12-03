import { InputType, Field, Int } from '@nestjs/graphql';
import { IsInt } from 'class-validator';
import { CreateNotificationTemplateInput } from './create-notification-template.input';

@InputType()
export class UpdateNotificationTemplateInput extends CreateNotificationTemplateInput {
  @Field(() => Int)
  @IsInt()
  id: number;
}
