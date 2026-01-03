import { Resolver } from '@nestjs/graphql';
import { BusinessFeature } from './entities/business-feature.entity';

@Resolver(() => BusinessFeature)
export class BusinessFeaturesResolver {
  // constructor(
  //   private readonly businessModulesService: BusinessModulesService,
  // ) {}
  // @Mutation(() => BusinessModule)
  // async createBusinessModule(
  //   @Args('createBusinessModuleInput')
  //   createBusinessModuleInput: CreateBusinessModuleInput,
  // ) {
  //   return await this.businessModulesService.create(createBusinessModuleInput);
  // }
  // @Query(() => [BusinessModule], { name: 'businessModules' })
  // findAll() {
  //   return this.businessModulesService.findAll();
  // }
}
