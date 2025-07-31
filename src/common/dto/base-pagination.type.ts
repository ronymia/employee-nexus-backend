import { InputType, Field, Int } from '@nestjs/graphql';
import { IsEnum, IsInt, IsString } from 'class-validator';

@InputType()
export class BasePaginationInput {
  @Field(() => Int, { nullable: true })
  @IsInt()
  page?: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  limit?: number;

  @Field(() => String, { nullable: true })
  @IsString()
  sortBy?: string = 'createdAt';

  @Field(() => String, { nullable: true })
  @IsEnum(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc';
}
