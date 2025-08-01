import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Module } from 'src/modules/modules/entities/module.entity';

@ObjectType()
export class BusinessModule {
  @Field(() => Int, { description: 'Business ID' })
  businessId: number;

  // @Field(() => Business, { description: 'Business' })
  // business: Business;

  @Field(() => Int, { description: 'Module ID' })
  systemModuleId: number;

  @Field(() => Module, { description: 'Module' })
  systemModule: Module;
}
