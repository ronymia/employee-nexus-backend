import { InputType, Field, Int } from '@nestjs/graphql';
import { IsOptional, IsString, IsInt } from 'class-validator';

@InputType()
export class QueryAssetInput {
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  businessId?: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  status?: string;
}
