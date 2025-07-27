import { IsInt, IsString } from 'class-validator';
import { CreateRoleInput } from './create-role.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdateRoleInput extends PartialType(CreateRoleInput) {
  @Field(() => ID, { description: 'Unique identifier for the role' })
  @IsInt()
  id: number;

  @Field(() => String, { description: 'Name of the role' })
  @IsString()
  name: string;

  @Field(() => Int, { nullable: true, description: 'ID of the business' })
  @IsInt()
  businessId: number;
}
