import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateAssetInput {
  @Field()
  name: string;

  @Field()
  code: string;

  @Field()
  date: string;

  @Field({ nullable: true })
  note?: string;

  @Field(() => Int, { nullable: true })
  assetTypeId?: number;

  @Field({ nullable: true })
  image?: string;

  @Field(() => Int, { nullable: true })
  assignedTo?: number; // Optional: if provided, assign the asset after creation
}
