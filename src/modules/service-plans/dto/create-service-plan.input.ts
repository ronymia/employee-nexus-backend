import { InputType, Int, Field, registerEnumType } from '@nestjs/graphql';
import { IsArray, IsEnum, IsInt, IsString } from 'class-validator';
import { Status } from 'generated/prisma';

registerEnumType(Status, {
  name: 'Status',
  description: 'Status of the service plan',
});

@InputType()
export class CreateServicePlanInput {
  @Field({ description: 'Name of the service plan' })
  @IsString()
  name: string;

  @Field({ description: 'Description of the service plan' })
  @IsString()
  description: string;

  @Field(() => Int, { description: 'One-time setup fee for the service plan' })
  @IsInt()
  setupFee: number;

  @Field(() => Int, { description: 'Price of the service plan' })
  @IsInt()
  price: number;

  @Field(() => [Int], {
    description: 'Module Ids for the service plan',
  })
  @IsArray()
  moduleIds: number[];
}
