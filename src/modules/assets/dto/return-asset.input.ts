import { InputType, Int, Field } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class ReturnAssetInput {
  @Field(() => Int)
  assetId: number;

  @Field(() => String, {
    nullable: true,
    description: 'Optional note for the asset assignment',
  })
  @IsString()
  @IsOptional()
  note: string;
}
