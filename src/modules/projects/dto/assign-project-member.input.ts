import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class AssignProjectMemberInput {
  @Field(() => Int)
  projectId: number;

  @Field(() => Int)
  userId: number;

  @Field({ nullable: true })
  role?: string;
}
