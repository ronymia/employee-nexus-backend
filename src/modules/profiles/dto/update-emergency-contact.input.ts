import { InputType, Field, Int } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class UpdateEmergencyContactInput {
  @Field(() => Int, { description: 'ID of the profile to update' })
  id: number;

  @Field(() => String, { description: 'Emergency contact name' })
  @IsString()
  name: string;

  @Field(() => String, { description: 'Emergency contact phone number' })
  @IsString()
  phone: string;

  @Field(() => String, { description: 'Relationship to the person' })
  @IsString()
  relation: string;
}
