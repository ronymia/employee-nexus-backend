import { InputType, Int, Field } from '@nestjs/graphql';
import { IsInt, IsOptional, IsString } from 'class-validator';

@InputType()
export class AssignAssetInput {
  @Field(() => Int, { description: 'ID of the asset to be assigned' })
  @IsInt()
  assetId: number;

  @Field(() => Int, {
    description: 'ID of the user to whom the asset is assigned',
  })
  @IsInt()
  assignedTo: number;

  @Field(() => String, {
    nullable: true,
    description: 'Optional note for the asset assignment',
  })
  @IsString()
  @IsOptional()
  note: string;

  @Field(() => Date, {
    description: 'Date when the asset was assigned',
  })
  @IsOptional()
  assignedAt: Date;
}
