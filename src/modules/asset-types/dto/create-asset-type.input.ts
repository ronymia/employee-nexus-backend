import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateAssetTypeInput {
  @Field(() => String, { description: 'Name of the asset type' })
  @IsString()
  name: string;

  @Field(() => String, { description: 'Description of the asset type' })
  @IsString()
  @IsOptional()
  description: string;
}
