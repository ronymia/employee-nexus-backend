import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ServicePlanModulesService } from './service-plan-modules.service';
import { ServicePlanModule } from './entities/service-plan-module.entity';
import { CreateServicePlanModuleInput } from './dto/create-service-plan-module.input';
import { UpdateServicePlanModuleInput } from './dto/update-service-plan-module.input';

@Resolver(() => ServicePlanModule)
export class ServicePlanModulesResolver {
  constructor(
    private readonly servicePlanModulesService: ServicePlanModulesService,
  ) {}

  @Mutation(() => ServicePlanModule)
  createServicePlanModule(
    @Args('createServicePlanModuleInput')
    createServicePlanModuleInput: CreateServicePlanModuleInput,
  ) {
    return this.servicePlanModulesService.create(createServicePlanModuleInput);
  }

  @Query(() => [ServicePlanModule], { name: 'servicePlanModules' })
  findAll() {
    return this.servicePlanModulesService.findAll();
  }

  @Query(() => ServicePlanModule, { name: 'servicePlanModuleById' })
  findOne(
    @Args('servicePlanId', { type: () => Int }) servicePlanId: number,
    @Args('systemModuleId', { type: () => Int }) systemModuleId: number,
  ) {
    return this.servicePlanModulesService.findOne(
      servicePlanId,
      systemModuleId,
    );
  }

  @Mutation(() => ServicePlanModule)
  updateServicePlanModule(
    @Args('updateServicePlanModuleInput')
    updateServicePlanModuleInput: UpdateServicePlanModuleInput,
  ) {
    return this.servicePlanModulesService.update(
      updateServicePlanModuleInput.servicePlanId,
      updateServicePlanModuleInput.systemModuleId,
      updateServicePlanModuleInput,
    );
  }

  @Mutation(() => ServicePlanModule)
  removeServicePlanModule(
    @Args('servicePlanId', { type: () => Int }) servicePlanId: number,
    @Args('systemModuleId', { type: () => Int }) systemModuleId: number,
  ) {
    return this.servicePlanModulesService.remove(servicePlanId, systemModuleId);
  }
}
