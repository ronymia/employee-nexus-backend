import { InputType, Int, Field } from '@nestjs/graphql';
import { IsBoolean, IsInt } from 'class-validator';

@InputType()
export class CreateBusinessModuleInput {
  @Field(() => Int, { description: 'Business ID' })
  @IsInt()
  businessId: number;

  @Field(() => Int, { description: 'System Module ID' })
  @IsInt()
  systemModuleId: number;

  @Field(() => Boolean, { description: 'Is Enabled' })
  @IsBoolean()
  isEnabled: boolean;
}
