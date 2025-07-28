import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class SystemModule {
  @Field(() => ID, { description: 'ID of the system module' })
  id: number;

  @Field(() => String, { description: 'Name of the system module' })
  name: string;

  @Field(() => Date, { description: 'Creation date of the system module' })
  createdAt: Date;

  @Field(() => Date, { description: 'Last update date of the system module' })
  updatedAt: Date;
}
