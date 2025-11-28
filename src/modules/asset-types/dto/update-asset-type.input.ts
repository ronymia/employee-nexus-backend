import { CreateAssetTypeInput } from './create-asset-type.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateAssetTypeInput extends PartialType(CreateAssetTypeInput) {
  @Field(() => Int)
  id: number;
}
