import { InputType, Field } from '@nestjs/graphql';
import { IsBoolean, IsString } from 'class-validator';

@InputType()
export class CreateSystemModuleInput {
  @Field(() => String, { description: 'Name of the system module' })
  @IsString()
  name: string;

  @Field(() => Boolean, { description: 'Is the system module enabled?' })
  @IsBoolean()
  isEnabled: boolean;
}
