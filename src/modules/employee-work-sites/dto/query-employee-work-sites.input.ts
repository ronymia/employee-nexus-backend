import { InputType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsOptional, IsBoolean } from 'class-validator';

@InputType()
export class QueryEmployeeWorkSitesInput {
  @Field(() => Int, { nullable: true, description: 'Filter by user ID' })
  @IsInt()
  @IsOptional()
  userId?: number;

  @Field(() => Int, { nullable: true, description: 'Filter by work site ID' })
  @IsInt()
  @IsOptional()
  workSiteId?: number;

  @Field(() => Boolean, {
    nullable: true,
    description: 'Filter by active status',
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
