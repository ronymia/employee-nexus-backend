import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { BusinessModulesService } from './business-modules.service';
import { BusinessModule } from './entities/business-module.entity';
import { CreateBusinessModuleInput } from './dto/create-business-module.input';
import { UpdateBusinessModuleInput } from './dto/update-business-module.input';

@Resolver(() => BusinessModule)
export class BusinessModulesResolver {
  constructor(
    private readonly businessModulesService: BusinessModulesService,
  ) {}

  @Mutation(() => BusinessModule)
  createBusinessModule(
    @Args('createBusinessModuleInput')
    createBusinessModuleInput: CreateBusinessModuleInput,
  ) {
    return this.businessModulesService.create(createBusinessModuleInput);
  }

  @Query(() => [BusinessModule], { name: 'businessModules' })
  findAll() {
    return this.businessModulesService.findAll();
  }

  @Query(() => BusinessModule, { name: 'businessModule' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.businessModulesService.findOne(id);
  }

  @Mutation(() => BusinessModule)
  updateBusinessModule(
    @Args('updateBusinessModuleInput')
    updateBusinessModuleInput: UpdateBusinessModuleInput,
  ) {
    return this.businessModulesService.update(
      updateBusinessModuleInput.id,
      updateBusinessModuleInput,
    );
  }

  @Mutation(() => BusinessModule)
  removeBusinessModule(@Args('id', { type: () => Int }) id: number) {
    return this.businessModulesService.remove(id);
  }
}
