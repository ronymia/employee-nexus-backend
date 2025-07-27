import { InputType, Int, Field } from '@nestjs/graphql';
import { IsInt, IsString } from 'class-validator';

@InputType()
export class CreateRoleInput {
  @Field(() => String, { description: 'Name of the role' })
  @IsString()
  name: string;

  @Field(() => Int, { nullable: true, description: 'ID of the business' })
  @IsInt()
  businessId: number;
}
