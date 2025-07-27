/* eslint-disable @typescript-eslint/no-unsafe-return */
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
  async createBusinessModule(
    @Args('createBusinessModuleInput')
    createBusinessModuleInput: CreateBusinessModuleInput,
  ) {
    return await this.businessModulesService.create(createBusinessModuleInput);
  }

  @Query(() => [BusinessModule], { name: 'businessModules' })
  findAll() {
    return this.businessModulesService.findAll();
  }

  @Query(() => BusinessModule, { name: 'businessModuleById' })
  findOne(
    @Args('businessId', { type: () => Int }) businessId: number,
    @Args('systemModuleId', { type: () => Int }) systemModuleId: number,
  ) {
    return this.businessModulesService.findOne(businessId, systemModuleId);
  }

  @Mutation(() => BusinessModule)
  updateBusinessModule(
    @Args('updateBusinessModuleInput')
    updateBusinessModuleInput: UpdateBusinessModuleInput,
  ) {
    return this.businessModulesService.update(
      updateBusinessModuleInput.businessId,
      updateBusinessModuleInput.systemModuleId,
      updateBusinessModuleInput,
    );
  }

  @Mutation(() => BusinessModule)
  removeBusinessModule(
    @Args('businessId', { type: () => Int }) businessId: number,
    @Args('systemModuleId', { type: () => Int }) systemModuleId: number,
  ) {
    return this.businessModulesService.remove(businessId, systemModuleId);
  }
}
