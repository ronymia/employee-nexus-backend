import { InputType, Int, Field } from '@nestjs/graphql';
import { IsDateString, IsOptional } from 'class-validator';

@InputType()
export class UnassignProjectMemberInput {
  @Field(() => Int)
  projectId: number;

  @Field(() => Int)
  userId: number;

  @Field(() => String)
  role: string;

  @Field({ nullable: true })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @Field({ nullable: true })
  @IsOptional()
  remarks?: string;
}
