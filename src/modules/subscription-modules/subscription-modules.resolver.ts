import { Resolver } from '@nestjs/graphql';
import { SubscriptionModule } from './entities/subscription-module.entity';

@Resolver(() => SubscriptionModule)
export class SubscriptionModulesResolver {
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
