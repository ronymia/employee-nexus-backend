import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class AssignWorkSiteInput {
  @Field(() => Int, { description: 'User ID of the employee' })
  userId: number;

  @Field(() => Int, { description: 'Work site ID to assign' })
  workSiteId: number;
}

@InputType()
export class UnassignWorkSiteInput {
  @Field(() => Int, { description: 'User ID of the employee' })
  userId: number;

  @Field(() => Int, { description: 'Work site ID to unassign' })
  workSiteId: number;
}
