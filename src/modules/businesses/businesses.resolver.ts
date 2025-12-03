import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { BusinessesService } from './businesses.service';
import {
  Business,
  BusinessQueryResponse,
  BusinessResponse,
} from './entities/business.entity';
import { CreateBusinessInput } from './dto/create-business.input';
import { UpdateBusinessInput } from './dto/update-business.input';
import { CreateUserInput } from '../users/dto/create-user.input';
import { CreateProfileInput } from '../profiles/dto/create-profile.input';
import { HttpStatus, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { PermissionsGuard } from '../permissions/guards/permission.guard';
import { RequirePermissions } from '../permissions/decorators/permissions.decorator';
import { PasswordHelpers } from 'src/helpers/passwordHelpers';
import { QueryBusinessInput } from './dto/query-business.input';

@Resolver(() => Business)
export class BusinessesResolver {
  constructor(private readonly businessesService: BusinessesService) {}

  // REGISTER USER WITH BUSINESS
  @Mutation(() => Business, { name: 'createUserWithBusiness' })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Business:create')
  @UseGuards(GqlAuthGuard)
  async createUserWithBusiness(
    @Args('createUserInput') createUserInput: CreateUserInput,
    @Args('createProfileInput') createProfileInput: CreateProfileInput,
    @Args('createBusinessInput') createBusinessInput: CreateBusinessInput,
  ) {
    createUserInput.password = await PasswordHelpers.passwordHash(
      createUserInput.password,
    );

    return await this.businessesService.createUserWithBusiness(
      createUserInput,
      createProfileInput,
      createBusinessInput,
    );
  }

  // CREATE BUSINESS ONLY
  // @Mutation(() => Business, { name: 'createBusiness' })
  // createBusiness(
  //   @Args('createBusinessInput') createBusinessInput: CreateBusinessInput,
  // ) {
  //   return this.businessesService.create(createBusinessInput);
  // }

  // FIND ALL BUSINESSES
  @Query(() => BusinessQueryResponse, { name: 'businesses' })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Business:read')
  @UseGuards(GqlAuthGuard)
  async findAll(@Args('query', { nullable: true }) query: QueryBusinessInput) {
    const result = await this.businessesService.findAll({ query });
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Business retrieved successfully`,
      meta: result?.meta,
      data: result?.data,
    };
  }

  // FIND ONE BUSINESS
  @Query(() => BusinessResponse, { name: 'businessById' })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Business:read')
  @UseGuards(GqlAuthGuard)
  async findOne(@Args('id', { type: () => Int }) id: number) {
    const result = await this.businessesService.findOne(id);

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Business retrieved successfully`,
      data: result,
    };
  }

  @Mutation(() => BusinessResponse, { name: 'updateBusiness' })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Business:update')
  @UseGuards(GqlAuthGuard)
  async updateBusiness(
    @Args('updateBusinessInput') updateBusinessInput: UpdateBusinessInput,
  ) {
    const result = await this.businessesService.update(updateBusinessInput);

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Business updated successfully`,
      data: result,
    };
  }

  @Mutation(() => BusinessResponse, { name: 'deleteBusiness' })
  @UseGuards(PermissionsGuard)
  @RequirePermissions('Business:delete')
  @UseGuards(GqlAuthGuard)
  async removeBusiness(@Args('id', { type: () => Int }) id: number) {
    const result = await this.businessesService.remove(id);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Business deleted successfully`,
      data: result,
    };
  }
}
