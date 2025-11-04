import { Resolver } from '@nestjs/graphql';
import { SubscriptionFeature } from './entities/subscription-feature.entity';

@Resolver(() => SubscriptionFeature)
export class SubscriptionFeaturesResolver {
  // constructor(
  //   private readonly subscriptionModulesService: SubscriptionModulesService,
  // ) {}
  // @Mutation(() => SubscriptionModule)
  // createSubscriptionModule(
  //   @Args('createSubscriptionModuleInput')
  //   createSubscriptionModuleInput: CreateSubscriptionModuleInput,
  // ) {
  //   return this.subscriptionModulesService.create(
  //     createSubscriptionModuleInput,
  //   );
  // }
}
