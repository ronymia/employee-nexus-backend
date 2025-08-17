import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class SystemModule {
  @Field(() => ID, { description: 'ID of the module' })
  id: number;

  @Field(() => String, { description: 'Name of the module' })
  name: string;

  @Field(() => Date, { description: 'Creation date of the module' })
  createdAt: Date;

  @Field(() => Date, { description: 'Last update date of the module' })
  updatedAt: Date;
}

@ObjectType()
export class SystemModuleResponse {
  @Field()
  statusCode: number;

  @Field()
  success: boolean;

  @Field()
  message: string;

  @Field(() => SystemModule)
  data: SystemModule;
}

@ObjectType()
export class SystemModuleQueryResponse {
  @Field()
  statusCode: number;

  @Field()
  success: boolean;

  @Field()
  message: string;

  @Field(() => [SystemModule])
  data: SystemModule[];
}
