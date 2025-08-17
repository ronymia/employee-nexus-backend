import { ObjectType, Field, Int } from '@nestjs/graphql';
import { SystemModule } from 'src/modules/system-modules/entities/system-module.entity';

@ObjectType()
export class BusinessModule {
  @Field(() => Int, { description: 'Business ID' })
  businessId: number;

  // @Field(() => Business, { description: 'Business' })
  // business: Business;

  @Field(() => Int, { description: 'System Module ID' })
  systemModuleId: number;

  @Field(() => SystemModule, { description: 'System Module' })
  systemModule: SystemModule;
}
