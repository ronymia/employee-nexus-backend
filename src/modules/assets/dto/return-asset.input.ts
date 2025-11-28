import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class ReturnAssetInput {
  @Field(() => Int)
  assetId: number;
}
