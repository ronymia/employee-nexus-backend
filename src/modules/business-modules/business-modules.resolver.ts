/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Resolver } from '@nestjs/graphql';
import { BusinessModule } from './entities/business-module.entity';

@Resolver(() => BusinessModule)
export class BusinessModulesResolver {
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
