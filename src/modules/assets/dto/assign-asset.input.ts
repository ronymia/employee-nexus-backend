import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class AssignAssetInput {
  @Field(() => Int)
  assetId: number;

  @Field(() => Int)
  assignedTo: number;
}
