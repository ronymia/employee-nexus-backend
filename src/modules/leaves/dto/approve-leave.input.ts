import { InputType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsOptional, IsString } from 'class-validator';

@InputType()
export class ApproveLeaveInput {
  @Field(() => Int, { description: 'Leave ID' })
  @IsInt()
  leaveId: number;

  @Field(() => String, { nullable: true, description: 'Remarks' })
  @IsString()
  @IsOptional()
  remarks?: string;
}
@InputType()
export class RejectLeaveInput {
  @Field(() => Int, { description: 'Leave ID' })
  @IsInt()
  leaveId: number;

  @Field(() => String, { description: 'Remarks' })
  @IsString()
  remarks: string;
}
