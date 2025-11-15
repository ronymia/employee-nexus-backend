import { InputType, Int, Field } from '@nestjs/graphql';
import { IsInt, IsBoolean, Min, Max } from 'class-validator';

@InputType()
export class CreateLeaveSettingInput {
  @Field(() => Int, {
    description: 'Start month for leave cycle (0-11, where 0=January)',
    defaultValue: 0,
  })
  @IsInt()
  @Min(0)
  @Max(11)
  startMonth: number;

  @Field(() => Boolean, {
    description: 'Whether leave requests are auto-approved',
    defaultValue: false,
  })
  @IsBoolean()
  autoApproval: boolean;
}
