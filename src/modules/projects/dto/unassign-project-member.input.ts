import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class UnassignProjectMemberInput {
  @Field(() => Int)
  projectId: number;

  @Field(() => Int)
  userId: number;

  @Field(() => String)
  role?: string;
}
