import { InputType, Int, Field } from '@nestjs/graphql';
import { IsDateString, IsOptional, IsBoolean } from 'class-validator';

@InputType()
export class AssignProjectMemberInput {
  @Field(() => Int)
  projectId: number;

  @Field(() => Int)
  userId: number;

  @Field({ nullable: true })
  role?: string;

  @Field()
  @IsDateString()
  startDate: Date;

  @Field({ nullable: true })
  @IsDateString()
  @IsOptional()
  endDate?: Date;

  @Field({ defaultValue: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  remarks?: string;

  @Field({ nullable: true })
  @IsOptional()
  notes?: string;
}
