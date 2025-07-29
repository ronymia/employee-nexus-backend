import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { BusinessesService } from './businesses.service';
import { Business } from './entities/business.entity';
import { CreateBusinessInput } from './dto/create-business.input';
import { UpdateBusinessInput } from './dto/update-business.input';
import { CreateUserInput } from '../users/dto/create-user.input';
import { CreateProfileInput } from '../profiles/dto/create-profile.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { PermissionsGuard } from '../permissions/guards/permission.guard';
import { RequirePermissions } from '../permissions/decorators/permissions.decorator';

@Resolver(() => Business)
export class BusinessesResolver {
  constructor(private readonly businessesService: BusinessesService) {}

  @Mutation(() => Business)
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Business:create')
  @UseGuards(GqlAuthGuard)
  async createUserWithBusiness(
    @Args('createUserInput') createUserInput: CreateUserInput,
    @Args('createProfileInput') createProfileInput: CreateProfileInput,
    @Args('createBusinessInput') createBusinessInput: CreateBusinessInput,
  ) {
    return await this.businessesService.createUserWithBusiness(
      createUserInput,
      createProfileInput,
      createBusinessInput,
    );
  }
  @Mutation(() => Business)
  createBusiness(
    @Args('createBusinessInput') createBusinessInput: CreateBusinessInput,
  ) {
    return this.businessesService.create(createBusinessInput);
  }

  @Query(() => [Business], { name: 'businesses' })
  findAll() {
    return this.businessesService.findAll();
  }

  @Query(() => Business, { name: 'business' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.businessesService.findOne(id);
  }

  @Mutation(() => Business)
  updateBusiness(
    @Args('updateBusinessInput') updateBusinessInput: UpdateBusinessInput,
  ) {
    return this.businessesService.update(
      updateBusinessInput.id,
      updateBusinessInput,
    );
  }

  @Mutation(() => Business)
  removeBusiness(@Args('id', { type: () => Int }) id: number) {
    return this.businessesService.remove(id);
  }
}
