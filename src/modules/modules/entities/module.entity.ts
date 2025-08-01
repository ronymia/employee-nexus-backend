import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Module {
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
export class ModuleResponse {
  @Field()
  statusCode: number;

  @Field()
  success: boolean;

  @Field()
  message: string;

  @Field(() => Module)
  data: Module;
}

@ObjectType()
export class ModuleQueryResponse {
  @Field()
  statusCode: number;

  @Field()
  success: boolean;

  @Field()
  message: string;

  @Field(() => [Module])
  data: Module[];
}
