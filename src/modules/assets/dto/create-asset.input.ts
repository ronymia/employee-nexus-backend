import { InputType, Int, Field } from '@nestjs/graphql';
import { IsInt, IsString } from 'class-validator';

@InputType()
export class CreateAssetInput {
  @Field()
  @IsString()
  name: string;

  @Field()
  code: string;

  @Field()
  date: string;

  @Field({ nullable: true })
  note?: string;

  @Field(() => Int, { description: `Asset type ID` })
  @IsInt()
  assetTypeId: number;

  @Field({ nullable: true })
  image?: string;

  @Field(() => Int, { nullable: true })
  assignedTo?: number; // Optional: if provided, assign the asset after creation
}
